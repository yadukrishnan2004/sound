import Sort from "./Sort";
import ProductCard from "./ProductCard";

function ProductDisplay({ data }) {
  window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="">
      <div className="w-full flex justify-center  ">
        <div className="flex justify-center w-[80%]">
          <Sort  data={data}/>
        </div>
      </div>
      <div className="flex justify-center">
        <div className=" bg-black flex w-[80%] ">



        </div>
      </div>
    </div>
  );
}

export default ProductDisplay;
