import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"

const R2_ACCOUNT_ID = "01644e982bf4fd61e45c31c2dc1a2a57"
const R2_BUCKET_NAME = "blog-images"

export async function uploadToR2(file: File): Promise<string> {
  const accessKeyId = process.env.R2_ACCESS_KEY_ID
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY

  if (!accessKeyId || !secretAccessKey) {
    throw new Error("R2 credentials not configured")
  }

  const s3Client = new S3Client({
    region: "auto",
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  })

  // Generate unique filename
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(7)
  const extension = file.name.split(".").pop()
  const filename = `images/${timestamp}-${randomString}.${extension}`

  // Convert File to Buffer
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  // Upload to R2
  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: filename,
    Body: buffer,
    ContentType: file.type,
  })

  await s3Client.send(command)

  // Return the path (not full URL, just the path)
  return `/${filename}`
}
