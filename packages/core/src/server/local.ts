import { getPort } from 'get-port-please'
import { clientDir } from '../dirs'
import { LOCAL_CLIENT_PORT } from '@next-atlas/shared'

export async function createLocalService() {
  const PORT = (await getPort({ port: Number(LOCAL_CLIENT_PORT) })).toString()
  const { execa } = await import('execa')
  if (process.env.DEV) {
    execa('npx', ['next', 'dev'], {
      cwd: clientDir,
      stdio: 'inherit',
      env: { PORT },
    })
  } else {
    execa('node', ['server.js'], {
      cwd: clientDir,
      stdio: 'inherit',
      env: { PORT },
    })
  }
}
