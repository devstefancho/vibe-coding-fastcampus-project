export interface BucketList {
  id: string;
  title: string;
  content: string;
  completed: boolean;
  user_id: string;
  created_at: string;
  updated_at: string;
  user_email?: string; // Added for social features
}

export interface Comment {
  id: string;
  bucket_list_id: string;
  user_id: string;
  comment: string;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      bucket_lists: {
        Row: BucketList;
        Insert: Omit<BucketList, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<BucketList, 'id' | 'created_at' | 'updated_at'>>;
      };
      comments: {
        Row: Comment;
        Insert: Omit<Comment, 'id' | 'created_at'>;
        Update: Partial<Omit<Comment, 'id' | 'created_at'>>;
      };
    };
  };
}
