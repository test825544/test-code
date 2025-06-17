export type GetCreditMemosResponse = {
  /** Credit memos success response */
  success: boolean;
  /** Credit memos data */
  data: CreditMemoItem[];
};

type CreditMemoItem = {
  /** Sales order increment ID */
  sales_order_increment_id: string;
  /** External order ID */
  external_order_id: string;
  /** Increment ID */
  increment_id: string;
  /** Total refunded */
  total_refunded?: number | null;
  /** Tax refunded */
  tax_refunded?: number | null;
  /** Transaction ID */
  transaction_id: string;
  /** Exact order creation date for filtering */
  created_at: string;
  /** Credit memo order items */
  Items?: OrderItem[];
};

type OrderItem = {
  /** Sku code */
  sku: string;
  /** SAP code */
  sap_code: string;
  /** Quantity refunded */
  qty_refunded: number;
  /** Row total including tax */
  row_total_incl_tax?: number | null;
  /** Tax amount */
  tax_amount?: number | null;
};
