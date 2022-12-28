import { HasuraStorageClient } from "@nhost/hasura-storage-js";

export const storage = new HasuraStorageClient({
  url: process.env.NHOST_BACKEND_URL + '/v1/storage',
  adminSecret: process.env.NHOST_ADMIN_SECRET
});