export const getDB = (name: string, version: number) =>
  new Promise<IDBDatabase>((resolve, reject) => {
    const dbRequest = indexedDB.open(name, version)
    dbRequest.addEventListener('success', () => resolve(dbRequest.result))
    dbRequest.addEventListener('error', () => reject(dbRequest.error))
  })
