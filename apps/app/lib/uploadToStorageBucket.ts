import { Storage } from "@google-cloud/storage";

export const uploadPlaidInstitutionLogo = async (institutionId: string, base64Img: string ) => {
  const storage = new Storage({
    projectId: 'finta-integration',
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      client_id: process.env.GOOGLE_CLIENT_ID,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/(\\r)|(\\n)/g, '\n')
    }
  });
  const bucketName = ['development', 'preview'].includes(process.env.VERCEL_ENV || "")
    ? 'institution_logos_dev'
    : 'institution_logos';
  const bucket = storage.bucket(bucketName);

  const logoBuffer = Buffer.from(base64Img, 'base64');
  const fileName = `${institutionId}.png`
  const file = bucket.file(fileName)
  
  await file.save(logoBuffer)
  return `http://storage.googleapis.com/${bucketName}/${fileName}`
}