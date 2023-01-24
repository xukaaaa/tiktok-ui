import Header from '../../components/Header/Header'
import Sidebar from '../../components/Sidebar/Sidebar'

function DefaultLayout({ children }) {
   return (
      <div className="flex flex-col items-center justify-center">
         <Header />

         <div className="mt-[var(--header-height)] flex h-[1000px] w-[1150px] justify-center">
            <Sidebar />
            <div className="flex-grow">{children}</div>
         </div>
      </div>
   )
}

export default DefaultLayout
