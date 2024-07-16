import { useContext } from "react"
import { AppContext } from "../contexst/AppContexst"

export const ErrorPage = () => {

  const { error } = useContext(AppContext)

  const errors: {err: number, desc: string}[] = [{err: 404, desc: 'Padge not found'},
                                                   {err: 403, desc: 'Invalid credentials'},
                                                   {err: 500, desc: 'Server error'}]
  return (
    <div>
      <p>{error}</p>
          {errors.filter(e => e.err === error)[0].desc}
    </div>
  )
}
