import { getExploreName } from '../utils/platform';

export const devConfig = {
  sdkKey: 'modQyYdPPQ3bXLrCrW5z6cYU1y2W7ULbyT9W',
  sdkSecret: 'myoda5mKMktK7cQcxRBJQdyL7JOL5TsaULkP',
  webEndpoint: 'zoom.us',
  topic: `${getExploreName()}-${Math.floor(Math.random() * 1000)}`,
  name: `${getExploreName()}-${Math.floor(Math.random() * 1000)}`,
  password: 'abc123',
  signature: '',
  sessionKey: `mZZtNKSNqBVoRdTQy9xQ`,
  userIdentity: '',
  // role = 1 to join as host, 0 to join as attendee. The first user must join as host to start the session
  role: 1
};
