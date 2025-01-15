import React from "react";
import { useChatStore } from "../store/useChatStore.js";
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage } = useChatStore();

  const handleImageChange = async (e) => {
    const file = e.targe.files[0];
    if(!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
    }

    const reader = new FileReader();
    reader.onload = () => {
        setImagePreview(reader.result);
    };
  };
   
  const removeImage = () => {
        setImagePreview(null);
        if(fileInputRef.current) {
            fileInputRef.current.value = "";
        }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if(!text.trim() && !imagePreview) return;
    try{
        await sendMessage({text : text.trim(),image:imagePreview});

        setText("");
        setImagePreview(null);
        if(fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }
    catch(error){
        toast.error(error.response.data.message);
    }
  };
  return (
    <div className="p-4 w-full">
      {imagePreview && (
        <div className="mb-4 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-2- object-cover rounded-lg border border-zinc-700"
            />
            <button
              type="button"
              onClick={removeImage}
              className="abosolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}
      <form obSubmit={handleSendMessage} className="flex itmes-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />
          <button
            className={`hidden sm:flex btn btn-circle ${
              imagePreview ? "text-emerald-500" : "text-zinc-400"
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>
        <button 
        type="submit"
        className="btn btn-sm btn-circle"
        disabled={!text.trim && !imagePreview}
        >
            <Send size={22}/>
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
