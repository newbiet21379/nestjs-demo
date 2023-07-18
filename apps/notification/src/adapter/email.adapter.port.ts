

export interface EmailAdapterPort {
    sendEmail: (email: string, subject: string, text: string) => Promise<void>;
}
