export type WithRequired<T, Key extends keyof T> = Omit<T, Key> & {
  [Property in Key]-?: NonNullable<T[Property]>
}
