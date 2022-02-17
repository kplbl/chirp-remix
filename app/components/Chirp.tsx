import { Form } from "remix";
import { PhotographIcon } from "@heroicons/react/outline";

function Chirp() {
  return (
    <div className="flex p-5 gap-5 w-full">
      <div className="p-2">
        <div className="bg-gray-200 w-10 h-10 rounded-full"></div>
      </div>
      <div className="flex-grow ">
        <img src="" alt="" />
        <Form method="post" action="/posts/new">
          <div>
            <input
              type="text"
              className="min-w-full p-2 border-b border-b-gray-300 mb-2"
              placeholder={"What's happening?"}
              name="title"
            />
            <input
              type="text"
              className="min-w-full p-2 border-b border-b-gray-300 mb-2"
              placeholder={"What's happening?"}
              name="content"
            />
          </div>
          <div className="flex justify-between">
            <div>
              <PhotographIcon className="h-6 w-6" />
            </div>
            <button
              type="submit"
              className="font-bold px-3 py-1 bg-blue-400 text-blue-50 rounded-2xl"
            >
              Chirp
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default Chirp;
