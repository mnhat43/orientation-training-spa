const Video = (props) => {
  const { videoId } = props
  return (
    <div style={{ position: 'relative', paddingBottom: '56.25%' }}>
      <iframe
        title="courseVideo"
        src={`https://www.youtube.com/embed/${videoId}`}
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
        allowFullScreen
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      ></iframe>
    </div>
  )
}

export default Video
