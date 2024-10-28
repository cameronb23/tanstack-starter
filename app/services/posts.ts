/**
 * This file contains an example minimal service for Posts.
 */

// import { DefaultError, useMutation, useQueryClient } from "@tanstack/react-query";
// import { createServerFn } from "@tanstack/start";
// import { z } from "zod";

// import prisma from '@/db';
// import {
//   queryOptions,
// } from '@tanstack/react-query';
// import { createServerFn } from '@tanstack/start';

// const getPosts = createServerFn('GET', async () => {
//   const all = await prisma.post.findMany();

//   return all;
// });

// const createPost = createServerFn("POST", async (data: z.infer<typeof createPostSchema>) => {
//   return prisma.post.create({
//     data: {
//       content: data.content,
//       author: {
//         connect: {
//           id: data.author
//         }
//       }
//     }
//   })
// });

// const postQueries = {
//   getAll: () =>
//     queryOptions({
//       queryKey: ['posts', 'all'],
//       queryFn: () => getPosts(),
//     }),
// } as const;

// const createPostSchema = z.object({
//   content: z.string(),
//   author: z.number(),
// });

// const useCreatePostMutation = () => {
//   const queryClient = useQueryClient();
//   return useMutation<Post, DefaultError, z.infer<typeof createPostSchema>>({
//     mutationFn: createPost,
//     onMutate: async () => {
//       await queryClient.cancelQueries({ queryKey: ['posts'] });
//       await queryClient.invalidateQueries({ queryKey: ['posts', 'all'] });
//     }
//   })
// }

// const postSchemas = {
//   createPost: createPostSchema,
// } as const;

// export { postQueries, postSchemas, useCreatePostMutation };
