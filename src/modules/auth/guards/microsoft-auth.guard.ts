import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard que pasa el objeto Response a Passport.
 * Necesario cuando useCookieInsteadOfSession=true para que
 * passport-azure-ad pueda guardar state/nonce en cookies.
 */
@Injectable()
export class MicrosoftAuthGuard extends AuthGuard('microsoft') {
  getAuthenticateOptions(context: ExecutionContext) {
    const response = context.switchToHttp().getResponse();
    return { response };
  }
}
