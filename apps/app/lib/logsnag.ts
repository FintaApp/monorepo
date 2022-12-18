import { LogSnag, PublishOptions } from 'logsnag';
import { Logger, log } from "next-axiom";

const shouldMockLogsnag = ['development', 'preview'].includes(process.env.VERCEL_ENV || "");

const logsnag = new LogSnag({ 
  token: process.env.LOGSNAG_TOKEN!,
  project: 'finta'
});

const logsnagPublish = ({ options, logger }: { options: PublishOptions, logger?: Logger }) => {
  const _logger = logger || log;

  if ( shouldMockLogsnag ) {
    return _logger.info("Mocking Logsnag publish", { options })
  }
  
  return logsnag.publish(options).then(() => _logger.info("Published to Logsnag", { options }))
}

export const logUserSignedUp = ({ name, email, userId }: { name?: string; email: string; userId: string; }) =>
  logsnagPublish({
    options: {
      channel: Channel.ACTIVITY,
      event: Event.USER_SIGNED_UP,
      description: `${name || email} just signed up!`,
      icon: "👤",
      notify: true,
      tags: { [Tag.USER_ID]: userId }
    }
  })

// Types
enum Channel {
  ACTIVITY = 'activity',
  ERRORS = 'errors',
  SYNCS = 'syncs'
}

enum Event {
  USER_SIGNED_UP = "User Signed Up"
}

enum Tag {
  USER_ID = 'user-id'
}