const log = require('../lib/logger')('Media:ipc')
const Media = require('./Media')
const {
  MEDIA_ADD,
  MEDIA_CLEANUP,
  MEDIA_REMOVE,
  MEDIA_UPDATE,
  _SUCCESS,
  _ERROR,
} = require('../../shared/actionTypes')

const ACTION_HANDLERS = {
  [MEDIA_ADD]: async ({ payload }) => Media.add(payload),
  [MEDIA_CLEANUP]: Media.cleanup,
  [MEDIA_REMOVE]: async ({ payload }) => Media.remove(payload),
  [MEDIA_UPDATE]: async ({ payload }) => Media.update(payload),
}

/**
 * IPC action handler for scanner (db writes occur in server process)
 */
module.exports = function (io) {
  process.on('message', async function (action) {
    const { type } = action

    if (typeof ACTION_HANDLERS[type] !== 'function') {
      log.debug('ignoring action: %s', type)
      return
    }

    try {
      const res = await ACTION_HANDLERS[type](action)

      process.emit('message', {
        ...action,
        type: type + _SUCCESS,
        payload: res,
      })
    } catch (err) {
      process.emit('message', {
        ...action,
        type: type + _ERROR,
        error: err,
      })

      log.debug(`error in ipc action ${type}: ${err.message}`)
    }
  })
}
