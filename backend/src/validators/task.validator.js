import {z} from 'zod';

export const createTaskSchema = z.object({
    title: z.string({
        required_error:'Title is Required!!!'
    }),
    description: z.string({
        required_error: 'Description is required!!!'
    })
    .optional(),
    date: z.string().datetime().optional()
})