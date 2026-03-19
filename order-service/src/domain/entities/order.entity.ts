export interface Order {
  id: string
  status: 'pending' | 'preparing' | 'completed' | 'failed'
  createdAt: Date
}