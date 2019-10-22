export const asyncPipe = (...fns: Function[]) => (param: any) =>
  fns.reduce(async (acc, fn) => fn(await acc), param)

export const _trace = (msg: string) => (x: any) => {
  console.log(msg, x)
  return x
}
