import cloudinary from "../config/cloudinary";
import { prisma } from "../config/prisma";

export async function updateProfile(params: {
  userId: string;
  name?: string;
  file?: Express.Multer.File;
}) {
  const { userId, name, file } = params;

  let avatarUrl: string | undefined;

  if (file) {
    const uploadResult = await new Promise<{ secure_url: string }>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "profile_pictures",
              public_id: userId,
              overwrite: true,
              resource_type: "image",
            },
            (error, result) => {
              if (error || !result) return reject(error);
              resolve(result as any);
            }
          )
          .end(file.buffer);
      }
    );

    avatarUrl = uploadResult.secure_url;
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      name: name ?? undefined,
      avatarUrl,
    },
    select: {
      id: true,
      email: true,
      name: true,
      avatarUrl: true,
      provider: true,
    },
  });

  return user;
}


export async function searchUsers(
  query: string,
  currentUserId: string
) {
  return prisma.user.findMany({
    where: {
      AND: [
        { id: { not: currentUserId } },
        {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { email: { contains: query, mode: "insensitive" } }
          ]
        }
      ]
    },
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true
    },
    take: 10
  });
}
