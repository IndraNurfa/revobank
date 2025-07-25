export interface Transaction {
  id?: number;
  account_id?: number;
  reference_id?: string;
  amount?: string;
  transaction_type?: string;
  transaction_status?: string;
  description?: string;
  additional_info?: AdditionalInfo;
  created_at?: Date;
  updated_at?: Date;
  account_transactions?: AccountTransaction[];
}

export interface AccountTransaction {
  id?: number;
  account_id?: number;
  reference_id?: string;
  amount?: string;
  account_transaction_type?: string;
  created_at?: Date;
  updated_at?: Date;
  account?: Account;
}

export interface Account {
  id?: number;
  user_id?: number;
  account_number?: string;
  account_name?: string;
  account_type?: string;
  balance?: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: null;
}

export interface AdditionalInfo {
  note?: string;
}
