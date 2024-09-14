import { useState } from 'react';
import clsx from 'clsx';
import ModalVideo from 'react-modal-video'
import styles from './HomeScreen.module.scss';
import 'react-modal-video/scss/modal-video.scss';

export const HomeScreen = ({ label, first, video }: { label: string; first?: boolean; video?: string }) => {
  const { wrapper, imageEl, title, top } = styles;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={clsx('screen', wrapper, first && top)}>
      {/* Обычное видео */}
      <video
        className={imageEl}
        autoPlay
        muted
        loop
        onClick={() => setIsOpen(true)}
      >
        <source src={video} type="video/mp4" />
      </video>

      <h2 className={title}>{label}</h2>

      {/* Модальное видео */}
      {
		video && (
			<ModalVideo
				channel="custom"
				isOpen={isOpen}
				url={video}
				onClose={() => setIsOpen(false)}
			/>
		)
	  }
    </div>
  );
};
