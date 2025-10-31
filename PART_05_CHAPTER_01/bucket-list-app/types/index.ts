export interface BucketList {
  id: string;
  title: string;
  content: string | null;
  completed: boolean;
  user_id: string;
  created_at: string;
  updated_at: string;
  user_email?: string; // Email of the user who created this bucket list
}

export interface Comment {
  id: string;
  bucket_list_id: string;
  user_id: string;
  comment: string;
  created_at: string;
}
