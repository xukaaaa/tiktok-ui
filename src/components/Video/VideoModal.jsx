import React, {
   memo,
   useEffect,
   useLayoutEffect,
   useRef,
   useState,
} from 'react'
import PropTypes from 'prop-types'
import Button from '../Button/Button'
import { useNavigate, useParams } from 'react-router-dom'
import videoApi from '../../api/videoApi'
import Modal from 'react-modal'
import { Dialog } from '@headlessui/react'
import {
   CommentIcon,
   HeartIcon,
   MusicIcon,
} from '../Icons/VideoIcons/VideoIcons'
import { VerifyBagdeIcon } from '../Icons/HeaderIcons/HeaderIcons'
import commentApi from '../../api/commentApi'
import Comment from './Comment'
import { CloseIcon } from '../Icons/VideoModalIcon/VideoModalIcon'
import AccountPreview from '../AccountPreview/AccountPreview'

function VideoModal() {
   const commentInputRef = useRef()
   const params = useParams()
   const navigate = useNavigate()
   const handleReturnPrevPage = () => {
      navigate(-1)
   }
   const [user, setUser] = useState()
   const [video, setVideo] = useState()
   const [commentList, setCommentList] = useState([])
   const [lastUpdated, setLastUpdated] = useState()

   useEffect(() => {
      const getaVideo = async () => {
         const response = await videoApi.getVideo(params.uuid)
         setVideo(response.data)
         setUser(response.data.user)
         setLastUpdated(new Date(response.data.updated_at))
      }

      const getComments = async () => {
         const response = await commentApi.getComments(params.uuid, {
            page: 1,
         })
         console.log(response.data)
         setCommentList(response.data)
      }

      Promise.all([getaVideo(), getComments()])
   }, [params.uuid])

   const formatDate = (lastUpdated) => {
      const currentDate = new Date()
      const toMiliSeconds = currentDate - lastUpdated
      const toSeconds = toMiliSeconds / 1000
      const toMinutes = toSeconds / 60
      const toHours = toMinutes / 60
      const toDays = toHours / 24

      if (currentDate.getFullYear() !== lastUpdated.getFullYear()) {
         return `${lastUpdated.getFullYear()}-${
            lastUpdated.getMonth() + 1
         }-${lastUpdated.getDate()}`
      } else if (toDays > 3) {
         return `${lastUpdated.getMonth() + 1}-${lastUpdated.getDate()}`
      } else if (toDays > 1 && toDays < 3) {
         return `${Math.floor(toDays)} ngày trước`
      } else if (toHours > 1) {
         return `${Math.floor(toHours)} giờ trước`
      } else if (toMinutes > 1) {
         return `${Math.floor(toMinutes)} phút trước`
      } else if (toSeconds > 1) {
         return `${Math.floor(toSeconds)} giây trước`
      } else {
         return 'Vừa xong'
      }
   }

   const handlePostComment = async () => {
      const content = commentInputRef.current.value
      if (content) {
         const response = await commentApi.postComment(params.uuid, {
            comment: content,
         })
         setCommentList((prev) => [response.data, ...prev])
         commentInputRef.current.value = ''
      }
   }
   return (
      <>
         {video && (
            <Dialog
               open={true}
               onClose={() => {
                  // setIsOpen(false)
                  navigate(-1)
               }}
               className="fixed inset-0 z-20 flex bg-white"
            >
               <div className="relative flex-grow overflow-hidden">
                  <div className="h-full w-full  blur-lg">
                     <div
                        style={{ backgroundImage: `url(${video.thumb_url})` }}
                        className={`absolute left-1/2 top-1/2 h-[10%] w-[10%] -translate-x-1/2 -translate-y-1/2 scale-[11] bg-cover`}
                     ></div>
                     <div className="absolute h-full w-full bg-black opacity-30"></div>
                  </div>

                  {/* Video */}

                  <Button
                     className={
                        'absolute top-5 left-5 z-50 h-10 w-10 justify-center rounded-full bg-[#54545480] outline-none hover:bg-[#25252599]'
                     }
                     onClick={handleReturnPrevPage}
                  >
                     <CloseIcon />
                  </Button>

                  <video
                     preload=""
                     className="absolute inset-0 h-full w-full object-contain"
                     autoPlay={true}
                     src={video.file_url}
                  ></video>
               </div>

               <div className="flex w-[544px] flex-col pt-8">
                  <div className="mb-[15px] flex h-[82px] items-center px-8 pt-[22px]">
                     <div className="group flex-grow cursor-pointer">
                        <AccountPreview
                           data={user}
                           bio={user.bio}
                           offset={[-26, -4]}
                        >
                           <div className="flex items-center">
                              <img
                                 className="mr-3 h-10 w-10 rounded-full"
                                 src={user.avatar}
                                 alt=""
                              />

                              <div className="flex flex-grow flex-col">
                                 <p className="flex items-baseline text-lg font-bold leading-[25px] group-hover:underline">
                                    {user.nickname}
                                    {user.tick && (
                                       <VerifyBagdeIcon className={'ml-1'} />
                                    )}
                                 </p>
                                 <p className="text-sm">
                                    {`${user.first_name} ${user.last_name}` ===
                                    ' '
                                       ? user.nickname
                                       : `${user.first_name} ${user.last_name}`}
                                    <span className="mx-1">·</span>
                                    <span>{formatDate(lastUpdated)}</span>
                                 </p>
                              </div>
                           </div>
                        </AccountPreview>
                     </div>

                     <Button
                        className={'h-9 flex-shrink-0 rounded border px-2'}
                     >
                        Đang Follow
                     </Button>
                  </div>

                  <div className="px-8">
                     <div className="leading-[22px]">{video.description}</div>

                     {video.music && (
                        <div className="mt-[10px] mb-4 flex cursor-pointer items-end hover:underline">
                           <MusicIcon className={'mr-2'} />
                           <span className="font-bold leading-[22px]">
                              nhạc nền - {video.music}
                           </span>
                        </div>
                     )}

                     <div className="py-4">
                        <div className="flex justify-between">
                           <div className="flex items-center text-xs font-bold leading-[17px]">
                              <Button>
                                 <HeartIcon
                                    className={
                                       'mr-[6px] h-8 w-8 rounded-full bg-[#1618230f] p-[6px]'
                                    }
                                 />
                              </Button>
                              <span className="mr-5">{video.likes_count}</span>

                              <CommentIcon
                                 className={
                                    'mr-[6px] h-8 w-8 rounded-full bg-[#1618230f] p-[6px]'
                                 }
                              />
                              <span>{video.comments_count}</span>
                           </div>
                        </div>

                        <div className="mt-4 flex h-9 w-[480px] items-center overflow-hidden rounded-lg border bg-[#16182308] text-sm">
                           <span className="truncate pl-3">
                              {window.location.href}
                           </span>
                           <Button
                              className={
                                 'h-[34px] min-w-[152px] px-[18px] font-bold hover:bg-white'
                              }
                           >
                              Sao chép liên kết
                           </Button>
                        </div>
                     </div>
                  </div>

                  <div className="flex-grow overflow-y-scroll border-y border-y-[#16182333] bg-[#f8f8f8] px-8 pt-6">
                     {/* Comments list */}
                     {commentList.map((comment) => (
                        <Comment
                           key={comment.id}
                           user={comment.user}
                           data={comment}
                        />
                     ))}
                  </div>

                  <div className="flex px-[30px] py-[21px]">
                     <input
                        ref={commentInputRef}
                        type="text"
                        className="peer h-10 flex-grow rounded-lg border border-transparent bg-[#1618230f] pl-[10px] outline-none focus:border-[#16182333]"
                        placeholder="Thêm bình luận..."
                     />
                     <Button
                        onClick={handlePostComment}
                        className={
                           'mr-1 w-12 justify-end text-sm font-semibold leading-[39px] text-primaryColor peer-placeholder-shown:text-[#16182357]'
                        }
                     >
                        Đăng
                     </Button>
                  </div>
               </div>
            </Dialog>
         )}
      </>
   )
}

VideoModal.propTypes = {}

export default memo(VideoModal)