import React from 'react'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import Modal from 'components/Modal/Modal'
import { formatDuration } from 'lib/dateTime'
import { closeSongInfo, setPreferredSong } from 'store/modules/songInfo'
import styles from './SongInfo.css'

const SongInfo = () => {
  const { isLoading, isVisible, songId, media } = useAppSelector(state => state.songInfo)

  const dispatch = useAppDispatch()
  const handleCloseSongInfo = () => dispatch(closeSongInfo())
  const handlePrefer = mediaId => dispatch(setPreferredSong({ songId, mediaId, isPreferred: true }))
  const handleRemovePrefer = mediaId => dispatch(setPreferredSong({ songId, mediaId, isPreferred: false }))

  const mediaDetails = media.result.map((mediaId) => {
    const item = media.entities[mediaId]
    const isPreferred = !!item.isPreferred

    return (
      <div key={item.mediaId} className={styles.media}>
        {item.path + (item.path.indexOf('/') === 0 ? '/' : '\\') + item.relPath}
        <br />
        <span className={styles.label}>Duration: </span>
        {formatDuration(item.duration)}
        <br />
        <span className={styles.label}>Media ID: </span>
        {mediaId}
        <br />
        <span className={styles.label}>Preferred: </span>
        {isPreferred
        && (
          <span>
            <strong>Yes</strong>
&nbsp;
            <a onClick={() => handleRemovePrefer(mediaId)}>(Unset)</a>
          </span>
        )}
        {!isPreferred
        && (
          <span>
            No&nbsp;
            <a onClick={() => handlePrefer(mediaId)}>(Set)</a>
          </span>
        )}
      </div>
    )
  })

  return (
    <Modal
      isVisible={isVisible}
      onClose={handleCloseSongInfo}
      title='Song Info'
      style={{
        width: '90%',
        height: '90%',
      }}
    >
      <div className={styles.container}>
        <p>
          <span className={styles.label}>Song ID: </span>
          {songId}
          <br />
          <span className={styles.label}>Media Files: </span>
          {isLoading ? '?' : media.result.length}
        </p>

        <div className={styles.mediaContainer}>
          {isLoading ? <p>Loading...</p> : mediaDetails}
        </div>

        <div>
          <button className='primary' onClick={handleCloseSongInfo}>
            Done
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default SongInfo
