import React, { useCallback, useEffect, useRef } from 'react'
import { useAppDispatch } from 'store/hooks'
import { createRoom, updateRoom, removeRoom } from 'store/modules/rooms'
import Modal from 'components/Modal/Modal'
import { Room } from 'shared/types'
import styles from './EditRoom.css'

let isPasswordDirty = false

interface EditRoomProps {
  room?: Room
  isVisible: boolean
  onClose(...args: unknown[]): unknown
}

const EditRoom = (props: EditRoomProps) => {
  const formRef = useRef(null)
  const dispatch = useAppDispatch()

  const handleSubmit = useCallback((e) => {
    e.preventDefault()

    const data = new FormData(formRef.current)
    data.set('status', data.get('status') ? 'open' : 'closed')

    if (props.room) {
      if (!isPasswordDirty) data.delete('password')
      dispatch(updateRoom({ roomId: props.room.roomId, data }))
    } else {
      dispatch(createRoom(data))
    }
  }, [dispatch, props.room])

  const handleRemoveClick = useCallback(() => {
    if (confirm(`Remove room "${props.room.name}" and its queue?`)) {
      dispatch(removeRoom(props.room.roomId))
    }
  }, [dispatch, props.room])

  // reset dirty flag when the editor "closes"
  useEffect(() => {
    if (props.isVisible === false) isPasswordDirty = false
  }, [props.isVisible])

  return (
    <Modal
      isVisible={props.isVisible}
      onClose={props.onClose}
      title={props.room ? 'Edit Room' : 'Create Room'}
      style={{ minWidth: '300px' }}
    >
      <form onSubmit={handleSubmit} ref={formRef} className={styles.form}>
        <input
          type='text'
          autoComplete='off'
          autoFocus={typeof props.room === 'undefined'}
          className={styles.field}
          defaultValue={props.room ? props.room.name : ''}
          name='name'
          placeholder='room name'
        />

        <input
          type='password'
          autoComplete='new-password'
          className={styles.field}
          defaultValue={props.room && props.room.hasPassword ? '*'.repeat(32) : ''}
          name='password'
          onChange={() => { isPasswordDirty = true }}
          placeholder='room password (optional)'
        />

        <label>
          <input
            type='checkbox'
            defaultChecked={!props.room || props.room.status === 'open'}
            name='status'
          />
           &nbsp;Open
        </label>
        <br />
        <br />

        <button type='submit' className={`${styles.btn} primary`}>
          {props.room ? 'Update Room' : 'Create Room'}
        </button>

        {props.room
        && (
          <button type='button' onClick={handleRemoveClick} className={styles.btn}>
            Remove Room
          </button>
        )}

        <button type='button' onClick={props.onClose}>Cancel</button>
      </form>
    </Modal>
  )
}

export default EditRoom
