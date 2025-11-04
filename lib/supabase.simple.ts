// Simple Supabase mock for development
export const supabase = {
  from: (table: string) => ({
    select: (columns?: string) => ({
      eq: (column: string, value: any) => ({
        single: () => Promise.resolve({ data: null, error: { code: 'PGRST116' } })
      })
    }),
    insert: (data: any) => ({
      select: () => ({
        single: () => Promise.resolve({ 
          data: { id: '1', ...data }, 
          error: null 
        })
      })
    })
  })
};