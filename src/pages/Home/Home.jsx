import React, { memo, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import Video from '../../feature/Video/Video'
import videoApi from '../../api/videoApi'
import VideoLoading from '../../feature/Video/VideoLoading'
import { Outlet } from 'react-router-dom'

function Home(props) {
   const [videoList, setVideoList] = useState([])
   const [page, setPage] = useState(1)
   const videoRef = useRef(null)

   useEffect(() => {
      const getVideoList = async () => {
         const response = await videoApi.getVideoList({
            type: 'for-you',
            page: page,
         })
         console.log(response.data)
         setVideoList([...videoList, ...response.data])
      }
      getVideoList()
   }, [page])

   useEffect(() => {
      let observer = new IntersectionObserver((entires) => {
         if (entires[0].isIntersecting) {
            console.log(entires[0])
            videoRef.current = null
            setPage(page + 1)
         }
      })

      if (videoRef.current) {
         observer.observe(videoRef.current)
      }

      return () => {
         if (videoRef.current) {
            observer.unobserve(videoRef.current)
         }
      }
   })

   return (
      <>
         <div>
            {videoList.map((video, index) => {
               if (index === videoList.length - 1)
                  return (
                     <div ref={videoRef} key={video.id}>
                        <Video data={video} />
                     </div>
                  )
               return (
                  <div key={video.id}>
                     <Video data={video} />
                  </div>
               )
            })}
            <VideoLoading />
         </div>
         <Outlet />
      </>
   )
}

Home.propTypes = {}

export default memo(Home)
