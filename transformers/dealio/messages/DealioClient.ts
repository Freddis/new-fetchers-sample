export interface DealioClient {
    member_id: number,
    created_at: Date,
    client_id: number | null,
    affiliate_id: string | null,
    campaign_id: string | null,
    country: string | null,
    sales_agent_id: number | null,
    registration_date: Date | null,
    last_login_date: Date | null,
    last_active_date: Date | null,
    updated_at: Date | null,
    trading_status: string | null,
    kyc_status: string | null,
    converted_at: Date | null,
    client_type: string | null,
    company: string | null,
    white_label: string | null,
    kyc_rejection_reason_code: string | null,
    last_update_time: Date | null,
}