import type {UserDetails} from "./model/UserDetailsModel.ts";

type ProfileProps = {
    user: string;
    userDetails: UserDetails | null;
}

export default function Profile(props:Readonly<ProfileProps>){
    return (
        <>
        <h2>Profile Page</h2>
        <p>{props.user}</p>
        </>
    )
}