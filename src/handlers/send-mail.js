import AWS from "aws-sdk";

// When ses is instantiated outside the handler function,
// it is created once and reused across multiple invocations of the Lambda function.
// This is because AWS Lambda retains the execution context for reuse (a feature called "container reuse"),
// which can result in significant performance improvements.
const ses = new AWS.SES({ region: "us-east-1" });

async function sendMail(event, context) {
  const record = event.Records[0];
  const sendEmailRequest = JSON.parse(record.body);
  const { subject, destinations, message } = sendEmailRequest;
  try {
    const result = await ses
      .sendEmail({
        Source: "elian.arismendi@naranjax.com",
        Destination: {
          ToAddresses: destinations,
        },
        Message: {
          Body: {
            Text: {
              Data: message,
            },
          },
          Subject: {
            Data: subject,
          },
        },
      })
      .promise();
    return result;
  } catch (error) {
    console.log({
      statusCode: error?.status || error?.statusCode || 500,
      body: error?.message,
      raw: error,
    });
  }
}

export const handler = sendMail;
