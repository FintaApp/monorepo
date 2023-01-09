
export const select = <T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> => {
  return keys.reduce((newObj, curr) => {
    newObj[curr] = obj[curr]

    return newObj
  }, {} as Pick<T, K>)
}

export function absoluteUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_URL}${path}`
}