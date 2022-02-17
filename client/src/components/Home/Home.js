import React, { useEffect } from "react";
import { CgMouse } from "react-icons/all";
import "./home.css";
import ProductCard from "./productCard";
import MetaData from "../layout/MetaData";
import { useSelector, useDispatch } from "react-redux";
import { listProducts, clearErrors } from "../../actions/productActions";
import Loading from "../layout/Loading/Loading";
import { useAlert } from "react-alert";
function Home() {
  const alert = useAlert();
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector(
    (state) => state.productData
  );
  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    dispatch(listProducts());
  }, [dispatch, error, alert]);
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <MetaData title="EquiliBrium" />
          <div className="banner">
            <p>Welcome to Equilibrium</p>
            <h1>Explore through Our Aesthetics</h1>
            <a href="#container">
              <button>
                Scroll <CgMouse />
              </button>
            </a>
          </div>
          <h2 className="homeHeading">Featured</h2>
          <div className="container" id="container">
            {products &&
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
          </div>
        </>
      )}
    </>
  );
}

export default Home;
