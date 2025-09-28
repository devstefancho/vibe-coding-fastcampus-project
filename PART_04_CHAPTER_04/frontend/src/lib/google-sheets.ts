import { google } from 'googleapis';
import { Transaction, Category } from '@/types/budget';

export class GoogleSheetsService {
  private sheets: any;
  private spreadsheetId: string;

  constructor() {
    // 환경변수에서 인증 정보 가져오기
    const credentials = {
      type: 'service_account',
      project_id: process.env.GOOGLE_PROJECT_ID,
      private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      client_id: process.env.GOOGLE_CLIENT_ID,
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
      client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.GOOGLE_CLIENT_EMAIL}`,
    };

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    this.sheets = google.sheets({ version: 'v4', auth });
    this.spreadsheetId = process.env.GOOGLE_SHEETS_ID!;
  }

  // 연결 테스트
  async testConnection(): Promise<boolean> {
    try {
      await this.sheets.spreadsheets.get({
        spreadsheetId: this.spreadsheetId,
      });
      return true;
    } catch (error) {
      console.error('Google Sheets connection failed:', error);
      return false;
    }
  }

  // 필요한 시트들이 존재하는지 확인하고 없으면 생성
  async initializeSheets(): Promise<boolean> {
    try {
      console.log('시트 구조 확인 중...');

      // 현재 스프레드시트 정보 가져오기
      const spreadsheet = await this.sheets.spreadsheets.get({
        spreadsheetId: this.spreadsheetId,
      });

      const existingSheets = spreadsheet.data.sheets?.map((sheet: any) => sheet.properties.title) || [];
      console.log('기존 시트들:', existingSheets);

      const requiredSheets = ['Transactions', 'Categories', 'Meta'];
      const sheetsToCreate = requiredSheets.filter(sheet => !existingSheets.includes(sheet));

      if (sheetsToCreate.length === 0) {
        console.log('모든 필요한 시트가 이미 존재합니다.');
        // 시트가 존재하는 경우에도 헤더가 설정되어 있는지 확인하고 없으면 추가
        await this.ensureSheetHeaders();
        return true;
      }

      console.log('생성할 시트들:', sheetsToCreate);

      // 배치 요청으로 시트들 생성
      const requests = sheetsToCreate.map(sheetName => ({
        addSheet: {
          properties: {
            title: sheetName,
          }
        }
      }));

      await this.sheets.spreadsheets.batchUpdate({
        spreadsheetId: this.spreadsheetId,
        resource: { requests }
      });

      console.log('시트 생성 완료');

      // 헤더 추가
      await this.setupSheetHeaders();

      return true;
    } catch (error) {
      console.error('시트 초기화 실패:', error);
      return false;
    }
  }

  // 각 시트에 헤더 설정
  private async setupSheetHeaders(): Promise<void> {
    try {
      console.log('시트 헤더 설정 중...');

      const headerRequests = [
        // Transactions 시트 헤더
        {
          range: 'Transactions!A1:H1',
          values: [['id', 'date', 'month', 'type', 'amount', 'categoryId', 'memo', 'updatedAt']]
        },
        // Categories 시트 헤더
        {
          range: 'Categories!A1:E1',
          values: [['id', 'name', 'type', 'active', 'updatedAt']]
        },
        // Meta 시트 헤더
        {
          range: 'Meta!A1:C1',
          values: [['key', 'value', 'updatedAt']]
        }
      ];

      // 각 헤더를 개별적으로 설정
      for (const headerRequest of headerRequests) {
        await this.sheets.spreadsheets.values.update({
          spreadsheetId: this.spreadsheetId,
          range: headerRequest.range,
          valueInputOption: 'USER_ENTERED',
          resource: { values: headerRequest.values },
        });
      }

      console.log('헤더 설정 완료');
    } catch (error) {
      console.error('헤더 설정 실패:', error);
      throw error;
    }
  }

  // 시트 헤더가 존재하는지 확인하고 없으면 설정
  private async ensureSheetHeaders(): Promise<void> {
    try {
      console.log('시트 헤더 확인 중...');

      const sheetsToCheck = [
        { name: 'Transactions', range: 'A1:H1', expectedHeaders: ['id', 'date', 'month', 'type', 'amount', 'categoryId', 'memo', 'updatedAt'] },
        { name: 'Categories', range: 'A1:E1', expectedHeaders: ['id', 'name', 'type', 'active', 'updatedAt'] },
        { name: 'Meta', range: 'A1:C1', expectedHeaders: ['key', 'value', 'updatedAt'] }
      ];

      for (const sheet of sheetsToCheck) {
        try {
          // 첫 번째 행 읽기
          const response = await this.sheets.spreadsheets.values.get({
            spreadsheetId: this.spreadsheetId,
            range: `${sheet.name}!${sheet.range}`,
          });

          const existingHeaders = response.data.values?.[0] || [];
          const headersMatch = sheet.expectedHeaders.every((header, index) => existingHeaders[index] === header);

          if (!headersMatch) {
            console.log(`${sheet.name} 시트 헤더 설정 중...`);
            await this.sheets.spreadsheets.values.update({
              spreadsheetId: this.spreadsheetId,
              range: `${sheet.name}!${sheet.range}`,
              valueInputOption: 'USER_ENTERED',
              resource: { values: [sheet.expectedHeaders] },
            });
          } else {
            console.log(`${sheet.name} 시트 헤더가 이미 올바르게 설정되어 있습니다.`);
          }
        } catch (error) {
          // 헤더가 없으면 설정
          console.log(`${sheet.name} 시트 헤더 설정 중...`);
          await this.sheets.spreadsheets.values.update({
            spreadsheetId: this.spreadsheetId,
            range: `${sheet.name}!${sheet.range}`,
            valueInputOption: 'USER_ENTERED',
            resource: { values: [sheet.expectedHeaders] },
          });
        }
      }

      console.log('헤더 확인/설정 완료');
    } catch (error) {
      console.error('헤더 확인 실패:', error);
      throw error;
    }
  }

  // 트랜잭션 읽기
  async getTransactions(): Promise<Transaction[]> {
    try {
      // 전체 시트 범위를 읽고 첫 번째 행은 건너뛴다
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: 'Transactions!A:H',
      });

      const rows = response.data.values || [];
      // 첫 번째 행(헤더)를 제외하고 데이터만 처리
      return rows.slice(1).map((row: string[]) => ({
        id: row[0] || '',
        date: row[1] as `${number}-${number}-${number}`,
        month: row[2] as `${number}-${number}`,
        type: row[3] as 'income' | 'expense',
        amount: parseInt(row[4]) || 0,
        categoryId: row[5] || '',
        memo: row[6] || '',
        updatedAt: row[7] || new Date().toISOString(),
      }));
    } catch (error) {
      console.error('Failed to get transactions:', error);
      return [];
    }
  }

  // 트랜잭션 중복 체크
  private async isTransactionExists(transactionId: string): Promise<boolean> {
    try {
      const transactions = await this.getTransactions();
      return transactions.some(t => t.id === transactionId);
    } catch (error) {
      console.error('Failed to check transaction existence:', error);
      return false;
    }
  }

  // 트랜잭션 추가 또는 업데이트
  async addTransaction(transaction: Transaction): Promise<boolean> {
    try {
      // 중복 체크
      const exists = await this.isTransactionExists(transaction.id);

      if (exists) {
        console.log(`Transaction ${transaction.id} already exists, updating instead`);
        return await this.updateTransaction(transaction);
      }

      const values = [[
        transaction.id,
        transaction.date,
        transaction.month,
        transaction.type,
        transaction.amount.toString(),
        transaction.categoryId,
        transaction.memo || '',
        transaction.updatedAt,
      ]];

      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: 'Transactions!A:H',
        valueInputOption: 'USER_ENTERED',
        resource: { values },
      });

      console.log(`Transaction ${transaction.id} added successfully`);
      return true;
    } catch (error) {
      console.error('Failed to add transaction:', error);
      return false;
    }
  }

  // 트랜잭션 업데이트
  async updateTransaction(transaction: Transaction): Promise<boolean> {
    try {
      // 먼저 해당 트랜잭션의 행 번호를 찾아야 함
      const transactions = await this.getTransactions();
      const rowIndex = transactions.findIndex(t => t.id === transaction.id);

      if (rowIndex === -1) {
        console.error('Transaction not found for update');
        return false;
      }

      const range = `Transactions!A${rowIndex + 2}:H${rowIndex + 2}`; // +2는 헤더와 0-index 보정
      const values = [[
        transaction.id,
        transaction.date,
        transaction.month,
        transaction.type,
        transaction.amount.toString(),
        transaction.categoryId,
        transaction.memo || '',
        transaction.updatedAt,
      ]];

      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range,
        valueInputOption: 'USER_ENTERED',
        resource: { values },
      });

      return true;
    } catch (error) {
      console.error('Failed to update transaction:', error);
      return false;
    }
  }

  // 트랜잭션 삭제
  async deleteTransaction(transactionId: string): Promise<boolean> {
    try {
      const transactions = await this.getTransactions();
      const rowIndex = transactions.findIndex(t => t.id === transactionId);

      if (rowIndex === -1) {
        console.error('Transaction not found for deletion');
        return false;
      }

      await this.sheets.spreadsheets.batchUpdate({
        spreadsheetId: this.spreadsheetId,
        resource: {
          requests: [{
            deleteDimension: {
              range: {
                sheetId: 0, // Transactions 시트의 ID (첫 번째 시트는 0)
                dimension: 'ROWS',
                startIndex: rowIndex + 1, // +1은 헤더 보정
                endIndex: rowIndex + 2,
              }
            }
          }]
        }
      });

      return true;
    } catch (error) {
      console.error('Failed to delete transaction:', error);
      return false;
    }
  }

  // 카테고리 읽기
  async getCategories(): Promise<Category[]> {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: 'Categories!A:E',
      });

      const rows = response.data.values || [];
      // 첫 번째 행(헤더)를 제외하고 데이터만 처리
      return rows.slice(1).map((row: string[]) => ({
        id: row[0] || '',
        name: row[1] || '',
        type: row[2] as 'income' | 'expense',
        active: row[3] === 'TRUE',
        updatedAt: row[4] || new Date().toISOString(),
      }));
    } catch (error) {
      console.error('Failed to get categories:', error);
      return [];
    }
  }

  // 카테고리 중복 체크
  private async isCategoryExists(categoryId: string): Promise<boolean> {
    try {
      const categories = await this.getCategories();
      return categories.some(c => c.id === categoryId);
    } catch (error) {
      console.error('Failed to check category existence:', error);
      return false;
    }
  }

  // 카테고리 추가 또는 업데이트
  async addCategory(category: Category): Promise<boolean> {
    try {
      // 중복 체크
      const exists = await this.isCategoryExists(category.id);

      if (exists) {
        console.log(`Category ${category.id} already exists, updating instead`);
        return await this.updateCategory(category);
      }

      const values = [[
        category.id,
        category.name,
        category.type,
        category.active.toString().toUpperCase(),
        category.updatedAt || new Date().toISOString(),
      ]];

      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: 'Categories!A:E',
        valueInputOption: 'USER_ENTERED',
        resource: { values },
      });

      console.log(`Category ${category.id} added successfully`);
      return true;
    } catch (error) {
      console.error('Failed to add category:', error);
      return false;
    }
  }

  // 카테고리 업데이트
  async updateCategory(category: Category): Promise<boolean> {
    try {
      const categories = await this.getCategories();
      const rowIndex = categories.findIndex(c => c.id === category.id);

      if (rowIndex === -1) {
        console.error('Category not found for update');
        return false;
      }

      const range = `Categories!A${rowIndex + 2}:E${rowIndex + 2}`;
      const values = [[
        category.id,
        category.name,
        category.type,
        category.active.toString().toUpperCase(),
        category.updatedAt || new Date().toISOString(),
      ]];

      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range,
        valueInputOption: 'USER_ENTERED',
        resource: { values },
      });

      return true;
    } catch (error) {
      console.error('Failed to update category:', error);
      return false;
    }
  }

  // 카테고리 삭제
  async deleteCategory(categoryId: string): Promise<boolean> {
    try {
      const categories = await this.getCategories();
      const rowIndex = categories.findIndex(c => c.id === categoryId);

      if (rowIndex === -1) {
        console.error('Category not found for deletion');
        return false;
      }

      await this.sheets.spreadsheets.batchUpdate({
        spreadsheetId: this.spreadsheetId,
        resource: {
          requests: [{
            deleteDimension: {
              range: {
                sheetId: 1, // Categories 시트의 ID (두 번째 시트는 1)
                dimension: 'ROWS',
                startIndex: rowIndex + 1,
                endIndex: rowIndex + 2,
              }
            }
          }]
        }
      });

      return true;
    } catch (error) {
      console.error('Failed to delete category:', error);
      return false;
    }
  }

  // 메타데이터 읽기
  async getMeta(key: string): Promise<string | null> {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: 'Meta!A:C',
      });

      const rows = response.data.values || [];
      // 첫 번째 행(헤더)를 제외하고 데이터만 처리
      const dataRows = rows.slice(1);
      const metaRow = dataRows.find((row: string[]) => row[0] === key);
      return metaRow ? metaRow[1] : null;
    } catch (error) {
      console.error('Failed to get meta:', error);
      return null;
    }
  }

  // 메타데이터 설정
  async setMeta(key: string, value: string): Promise<boolean> {
    try {
      // 기존 메타데이터 확인
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: 'Meta!A2:C',
      });

      const rows = response.data.values || [];
      const rowIndex = rows.findIndex((row: string[]) => row[0] === key);

      const values = [[key, value, new Date().toISOString()]];

      if (rowIndex !== -1) {
        // 업데이트
        const range = `Meta!A${rowIndex + 2}:C${rowIndex + 2}`;
        await this.sheets.spreadsheets.values.update({
          spreadsheetId: this.spreadsheetId,
          range,
          valueInputOption: 'USER_ENTERED',
          resource: { values },
        });
      } else {
        // 추가
        await this.sheets.spreadsheets.values.append({
          spreadsheetId: this.spreadsheetId,
          range: 'Meta!A:C',
          valueInputOption: 'USER_ENTERED',
          resource: { values },
        });
      }

      return true;
    } catch (error) {
      console.error('Failed to set meta:', error);
      return false;
    }
  }

  // 중복 제거 유틸리티 함수
  private removeDuplicateTransactions(transactions: Transaction[]): Transaction[] {
    const uniqueTransactions = new Map<string, Transaction>();

    // ID 기준으로 중복 제거, 최신 updatedAt을 가진 항목 유지
    transactions.forEach(transaction => {
      const existing = uniqueTransactions.get(transaction.id);
      if (!existing || new Date(transaction.updatedAt) > new Date(existing.updatedAt)) {
        uniqueTransactions.set(transaction.id, transaction);
      }
    });

    return Array.from(uniqueTransactions.values());
  }

  private removeDuplicateCategories(categories: Category[]): Category[] {
    const uniqueCategories = new Map<string, Category>();

    // ID 기준으로 중복 제거, 최신 updatedAt을 가진 항목 유지
    categories.forEach(category => {
      const existing = uniqueCategories.get(category.id);
      if (!existing || new Date(category.updatedAt || '') > new Date(existing.updatedAt || '')) {
        uniqueCategories.set(category.id, category);
      }
    });

    return Array.from(uniqueCategories.values());
  }

  // 전체 동기화 (로컬 → 스프레드시트)
  async syncToSheets(transactions: Transaction[], categories: Category[]): Promise<boolean> {
    try {
      console.log('전체 동기화 시작...');

      // 데이터 중복 제거
      const uniqueTransactions = this.removeDuplicateTransactions(transactions);
      const uniqueCategories = this.removeDuplicateCategories(categories);

      console.log(`거래 데이터: ${transactions.length}개 → ${uniqueTransactions.length}개 (중복 ${transactions.length - uniqueTransactions.length}개 제거)`);
      console.log(`카테고리 데이터: ${categories.length}개 → ${uniqueCategories.length}개 (중복 ${categories.length - uniqueCategories.length}개 제거)`);

      // 1. 트랜잭션 시트 클리어 (헤더 제외)
      await this.sheets.spreadsheets.values.clear({
        spreadsheetId: this.spreadsheetId,
        range: 'Transactions!2:1000',
      });

      // 2. 카테고리 시트 클리어 (헤더 제외)
      await this.sheets.spreadsheets.values.clear({
        spreadsheetId: this.spreadsheetId,
        range: 'Categories!2:1000',
      });

      // 3. 트랜잭션 데이터 추가
      if (uniqueTransactions.length > 0) {
        const transactionValues = uniqueTransactions.map(t => [
          t.id, t.date, t.month, t.type, t.amount.toString(), t.categoryId, t.memo || '', t.updatedAt
        ]);

        await this.sheets.spreadsheets.values.append({
          spreadsheetId: this.spreadsheetId,
          range: 'Transactions!A:H',
          valueInputOption: 'USER_ENTERED',
          resource: { values: transactionValues },
        });
      }

      // 4. 카테고리 데이터 추가
      if (uniqueCategories.length > 0) {
        const categoryValues = uniqueCategories.map(c => [
          c.id, c.name, c.type, c.active.toString().toUpperCase(), c.updatedAt || new Date().toISOString()
        ]);

        await this.sheets.spreadsheets.values.append({
          spreadsheetId: this.spreadsheetId,
          range: 'Categories!A:E',
          valueInputOption: 'USER_ENTERED',
          resource: { values: categoryValues },
        });
      }

      // 5. 마지막 동기화 시간 업데이트
      await this.setMeta('lastSyncAt', new Date().toISOString());

      console.log('전체 동기화 완료');
      return true;
    } catch (error) {
      console.error('Failed to sync to sheets:', error);
      return false;
    }
  }
}