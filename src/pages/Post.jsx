import { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import { MdOutlineMessage } from "react-icons/md";
import { useParams } from "react-router-dom";
import { supabase } from "../../supabaseClient";


const Post = () => {

    const { id } = useParams();
    const [post, setPost] = useState([]);
    const [thatUser, setThatUser] = useState('');
    const [like, setLike] = useState(0);

    useEffect(() => {
        ; (async () => {
            try {
                // Selected Blog
                const { data } = await supabase
                    .from('blog_posts')
                    .select(`
                        id,
                        user_id,
                        blog_title,
                        summary,
                        blog_content,
                        formated_time,
                        image_url,
                        comments (
                            id,
                            content
                        ),
                        likes(
                            id,
                            likes
                        )
                    `)
                    .eq('id', id);
                if (data) {
                    setPost(data[0]);
                    setThatUser(data[0].user_id);
                    console.log(data);

                    // Author Details
                    const response = await supabase.
                        from('users')
                        .select()
                        .eq('id', data[0].user_id);
                    console.log(response.data[0]);
                    setThatUser(response.data[0]);
                }
            } catch (error) {
                console.log(error);
            }
        })();
    }, [])

    const updateLike = async () => {
        setLike(1);
        const { data, error } = await supabase
            .from('likes')
            .insert([{
                post_id: post.id,
                likes: 
        }]);
        console.log(data);
        console.log(error);
    }

    return (
        <section className="p-5 bg-slate-100">
            <div className="my-3 flex items-center justify-between container mx-auto p-4">
                <div className="flex items-center">
                    <img src={thatUser?.avatar_url ? thatUser?.avatar_url : "/blank-avatar.webp"}
                        className="w-20 rounded-full" />
                    <div className="mx-2">
                        <p className="text-slate-500 text-2xl font-semibold">
                            {thatUser?.name}
                        </p>
                        <p className="text-black text-lg font-medium">
                            {post?.formated_time}
                        </p>
                    </div>
                </div>

                <div className="flex items-center">
                    <div className="mx-2 flex items-center">
                        <MdOutlineMessage className="text-3xl" />
                        <p className="mx-1 flex items-center font-medium text-lg mb-1">
                            {(post?.comments)?.length}
                        </p>
                    </div>
                    <div className="mx-2 flex items-center cursor-pointer"
                        onClick={updateLike}>
                        <FaHeart className="text-3xl text-pink-500" />
                        <p className="mx-1 flex items-center font-medium text-lg mb-1">
                            {(post?.likes)?.length}
                        </p>
                    </div>
                </div>

            </div>
            {post &&
                (
                    <>
                        <div className="p-3 container mx-auto w-3/4">
                            <div className="mt-10">
                                <div className="w-3/4 mx-auto">
                                    <p className="text-5xl text-center font-extrabold mb-7">
                                        {post?.blog_title}
                                    </p>
                                    <p className="text-xl text-center text-gray-400 mt-3 mb-5">
                                        {post?.summary}
                                    </p>
                                </div>
                                <div className="w-full my-3">
                                    <img src={post?.image_url}
                                        className="h-[35em] mx-auto border" />
                                </div>
                                <div className="w-3/4 mx-auto">
                                    <div className="text-2xl p-3"
                                        dangerouslySetInnerHTML={{ __html: post?.blog_content }}
                                    />
                                </div>
                            </div>
                        </div>

                    </>
                )
            }
        </section>
    )
};

export default Post;
