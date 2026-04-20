import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import { logger } from "./logger";
import { error } from "./error";

const config = {
    region: Bun.env.AWS_REGION!,
    credentials: {
        accessKeyId: Bun.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: Bun.env.AWS_SECRET_ACCESS_KEY!,
    },
};

export const sendSMS = async (phone: string, message: string) => {
    try {
        const client = new SNSClient(config);
        const command = new PublishCommand({
            PhoneNumber: phone,
            Message: message,
            MessageAttributes: {
                'AWS.SNS.SMS.SMSType': {
                    DataType: 'String',
                    StringValue: 'Transactional'
                }
            }
        });
        const sendSms = await client.send(command)
        return sendSms;
    } catch (err: any) {
        logger.error({ location: "sendSMS" }, err.message);
        throw error(500, "Error al enviar el mensaje.");
    }
};