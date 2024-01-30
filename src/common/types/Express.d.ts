import { IJwtPayload } from './Jwt-payload.types';

declare global {
  namespace Express {
    interface User extends IJwtPayload {}
  }
}
