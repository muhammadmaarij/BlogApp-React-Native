import createDataContext from "./createDataContext";
import jsonServer from "../api/jsonServer";

// const BlogContext = React.createContext();

const blogReducer = (state, action) => {
  switch (action.type) {
    case "add_blogpost":
      return [
        ...state,
        {
          id: Math.floor(Math.random() * 99999),
          title: action.payload.title,
          content: action.payload.content,
          // title: `Blog Post #${state.length + 1}`,
        },
      ];
    case "delete_blogpost":
      return state.filter((blogPost) => blogPost.id !== action.payload);
    case "edit_blogpost":
      return state.map((blogPost) => {
        return blogPost.id === action.payload.id ? action.payload : blogPost;
      });
    case "get_blogposts":
      return action.payload;
    default:
      return state;
  }
};

const getBlogPosts = (dispatch) => {
  return async () => {
    const response = await jsonServer.get("/blogposts");
    // response.data === [{}, {}, {}]
    dispatch({ type: "get_blogposts", payload: response.data });
  };
};

const addBlogPost = (dispatch) => {
  // return (title, content, callback) => {
  //   dispatch({
  //     type: "add_blogpost",
  //     payload: { title: title, content: content },
  //   });
  //   if (callback) {
  //     callback();
  //   }
  // };

  return async (title, content, callback) => {
    await jsonServer.post("/blogposts", { title, content });

    // dispatch({ type: "get_blogposts", payload: response.data });
    if (callback) {
      callback();
    }
  };
};

// outside api
// const addBlogPost = (dispatch) => {
//   return async (title, content, callback) => {
//     try {
//       await axios.post("assdfd", title, content);
//       dispatch({
//         type: "add_blogpost",
//         payload: { title: title, content: content },
//       });
//       callback();
//     } catch (e) {
//       console.log(e);
//     }
//   };
// };

const deleteBlogPost = (dispatch) => {
  return async (id) => {
    await jsonServer.delete(`/blogposts/${id}`);

    dispatch({ type: "delete_blogpost", payload: id });
  };
};

const editBlogPost = (dispatch) => {
  return async (id, title, content, callback) => {
    await jsonServer.put(`/blogposts/${id}`, { title, content });
    dispatch({
      type: "edit_blogpost",
      payload: { id: id, title: title, content: content },
    });
    if (callback) {
      callback();
    }
  };
};

export const { Context, Provider } = createDataContext(
  blogReducer,
  { addBlogPost, deleteBlogPost, editBlogPost, getBlogPosts },
  []
  // [{ title: "Only for Test", content: "Test Post", id: "1" }]
);

// export const BlogProvider = ({ children }) => {
//   // const [blogPosts, setBlogPosts] = useState([]);
//   // const addBlogPost = () => {
//   //   setBlogPosts([
//   //     ...blogPosts,
//   //     { title: `Blog Post #${blogPosts.length + 1}` },
//   //   ]);
//   // };

//   const [blogPosts, dispatch] = useReducer(blogReducer, []);

// const addBlogPost = () => {
//   dispatch({ type: "add_blogpost" });
// };

//   return (
//     <BlogContext.Provider value={{ data: blogPosts, addBlogPost }}>
//       {children}
//     </BlogContext.Provider>
//   );
// };

// export default BlogContext;
