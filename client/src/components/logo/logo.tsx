import { PROTECTED_ROUTES } from "@/routes/common/routePath"
import { Link } from "react-router-dom"
import logoImage from "@/assets/image.png"

const Logo = (props: { url?: string }) => {
  return (
    <Link to={props.url || PROTECTED_ROUTES.OVERVIEW} className="flex items-center gap-2">
      <div className="h-8 w-8 rounded flex items-center justify-center overflow-hidden">
        <img 
          src={logoImage} 
          alt="Zorvyn Logo" 
          className="h-full w-full object-cover"
        />
      </div>
      <span className="font-semibold text-lg">Zorvyn</span>
    </Link>
  )
}

export default Logo