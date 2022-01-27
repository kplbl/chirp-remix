export default function NewJokeRoute() {
  return (
    <div>
      <p>add your own joke</p>
      <form action="post">
        <div>
          <label htmlFor="name">Name:</label>
          <input type="text" name="name" />
        </div>
        <div>
          <label htmlFor="content">Content:</label>
          <textarea name="content" id="" cols="30" rows="10"></textarea>
        </div>
        <div>
          <button type="submit" className="button">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
