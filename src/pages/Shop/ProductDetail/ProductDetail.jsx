import React, { useCallback, useEffect, useState, useContext } from "react";
import Breadcrumb from "../Breadcrumb";
import "./css/ProductDetail.css";
import { RiShoppingCartLine } from "react-icons/ri";
import productDetailsApi from "../../../apis/productDetailsApi";
import errorImage from "../../../asset/img/error_image.png";
import { useNavigate, useParams } from "react-router-dom";
import { FaExchangeAlt, FaShippingFast } from "react-icons/fa";
import productsApi from "../../../apis/productsApi";
import inventoriesApi from "../../../apis/inventoriesApi";
import { CartContext } from "../Cart/context/CartContext";
import { toast } from "react-toastify"; // Import toast
import ReactQuill from "react-quill"; // Import React Quill
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import { AuthContext } from "../../Auth/contexts/AuthContext";

export default function ProductDetail() {
  const { addToCart } = useContext(CartContext);
  const [productDetails, setProductDetails] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [inventoryQuantity, setInventoryQuantity] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { id: productId } = useParams();
  const [productInfo, setProductInfo] = useState([]);
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [productId]);

  const fetchProductDetails = useCallback(() => {
    productDetailsApi
      .getByProductId(productId)
      .then((response) => {
        const data = response.data.data;
        setProductDetails(data);
        setSelectedProduct(null);
        setSelectedColor(null);
        setSelectedSize(null);
        setInventoryQuantity(null);
        setQuantity(1);
        if (data.length > 0 && data[0].images && data[0].images.length > 0) {
          setSelectedImage(data[0].images[0]); // Chọn ảnh đầu tiên làm ảnh chính mặc định
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [productId]);

  const fetchProductInfo = useCallback(() => {
    productsApi
      .getProductById(productId)
      .then((response) => {
        const data = response.data;
        setProductInfo(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [productId]);

  const fetchInventoryQuantity = (productDetailId) => {
    inventoriesApi
      .findByProductDetailId(productDetailId)
      .then((response) => {
        const inventoryData = response.data.data;
        if (inventoryData && inventoryData.length > 0) {
          setInventoryQuantity(inventoryData[0].inventoryQuantity);
        } else {
          setInventoryQuantity(0);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchProductDetails();
    fetchProductInfo();
  }, [fetchProductDetails, fetchProductInfo]);
  const updateSelectedProduct = (colorId, sizeId) => {
    const updatedProduct = productDetails.find(
      (product) =>
        product.color_id === colorId &&
        product.size_id === sizeId &&
        product.price &&
        product.price.price_selling > 0
    );
    setSelectedProduct(updatedProduct);
    if (updatedProduct) {
      fetchInventoryQuantity(updatedProduct.id);
      // Update the selected image if the updated product has images
      if (updatedProduct.images && updatedProduct.images.length > 0) {
        setSelectedImage((prevImage) =>
          prevImage && updatedProduct.images.includes(prevImage)
            ? prevImage
            : updatedProduct.images[0]
        );
      } else {
        // Keep the previously selected image if no new image is available
        setSelectedImage((prevImage) =>
          prevImage && prevImage.length > 0 ? prevImage : errorImage
        );
      }
    } else {
      // Keep the previously selected image if no product is found
      setSelectedImage((prevImage) =>
        prevImage && prevImage.length > 0 ? prevImage : errorImage
      );
      setInventoryQuantity(null);
    }
    setQuantity(1);
  };

  const handleColorChange = (colorId) => {
    setSelectedColor((prevColor) => {
      const newColor = prevColor === colorId ? null : colorId;
      if (selectedSize) {
        updateSelectedProduct(newColor, selectedSize);
      }
      return newColor;
    });
  };

  const handleSizeChange = (sizeId) => {
    setSelectedSize((prevSize) => {
      const newSize = prevSize === sizeId ? null : sizeId;
      if (selectedColor) {
        updateSelectedProduct(selectedColor, newSize);
      }
      return newSize;
    });
  };

  const getUniqueValues = (items, key) => {
    return [...new Set(items.map((item) => item[key]))];
  };

  const handleAddToCart = () => {
    if (selectedProduct) {
      if (inventoryQuantity === 0) {
        toast.error("Sản phẩm đã hết hàng."); // Show error toast for out of stock
        return;
      }

      addToCart({
        id: selectedProduct.id,
        name: productInfo.name,
        images: productInfo.product_images,
        color: selectedProduct.color_name,
        size: selectedProduct.size_name,
        quantity,
        price: selectedProduct.price,
        productDetailId: selectedProduct.id,
      });
      toast.success("Sản phẩm đã được thêm vào giỏ hàng!"); // Show success toast
    } else {
      toast.error("Vui lòng chọn màu sắc và kích thước."); // Show error toast
    }
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để tiếp tục mua hàng.");
      navigate("/login");
      return;
    }

    if (selectedProduct) {
      if (inventoryQuantity === 0) {
        toast.error("Sản phẩm đã hết hàng."); // Show error toast for out of stock
        return;
      }

      navigate("/orderPage", {
        state: {
          selectedItems: [
            {
              productDetailId: selectedProduct.id,
              quantity,
            },
          ],
        },
      });
    } else {
      toast.error("Vui lòng chọn màu sắc và kích thước."); // Show error toast
    }
  };

  const getUniqueImages = (productDetails) => {
    const allImages = productDetails.flatMap((product) => product.images || []);
    const uniqueImageUrls = [...new Set(allImages.map((image) => image))];
    return uniqueImageUrls;
  };

  const uniqueImages = getUniqueImages(productDetails);

  const incrementQuantity = () => {
    setQuantity((prevQuantity) => Math.min(prevQuantity + 1, 99));
  };

  const decrementQuantity = () => {
    setQuantity((prevQuantity) => Math.max(prevQuantity - 1, 1));
  };

  return (
    <div>
      <Breadcrumb productName={productInfo.name} />
      <div className="container">
        <div className="form-container-detail">
          <div className="product-detail">
            <div className="product-image">
              {productDetails.length > 0 && (
                <div>
                  <img
                    src={
                      selectedImage
                        ? `http://localhost:8080/uploads/${selectedImage}`
                        : errorImage
                    }
                    alt="Product"
                    className="img-container"
                  />
                  <ul className="d-flex justify-content-between img-children">
                    {uniqueImages.map((image, index) => (
                      <li
                        key={index}
                        className="img-child"
                        onClick={() => setSelectedImage(image)}
                      >
                        <img
                          src={`http://localhost:8080/uploads/${image}`}
                          style={{ width: "100px", height: "100px" }}
                          alt={`Thumbnail ${index}`}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="product-info">
              <h3>{productInfo.name}</h3>

              <div className="form-price">
                {selectedProduct ? (
                  <p>
                    Giá:{" "}
                    <span className="original-price">
                      {selectedProduct.price.price_selling.toLocaleString()}đ
                    </span>{" "}
                    <span className="sale-price">
                      {selectedProduct.price.promotion_price > 0
                        ? selectedProduct.price.promotion_price.toLocaleString()
                        : selectedProduct.price.price_selling.toLocaleString()}
                      đ
                    </span>
                  </p>
                ) : (
                  <p>Giá: 1đ.</p>
                )}
              </div>

              <div className="return-policy mt-3">
                <h5>Chính sách đổi trả</h5>
                <p>
                  <FaExchangeAlt className="me-2" />
                  Đổi trả trong vòng 7 ngày.
                </p>
              </div>
              <div className="shipping-method mt-3">
                <h5>Phương thức vận chuyển</h5>
                <p>
                  <FaShippingFast className="me-2" />
                  Miễn phí vận chuyển.
                </p>
              </div>

              <div className="product-sizes mt-3">
                <h5>Kích thước:</h5>
                {getUniqueValues(productDetails, "size_id").map((sizeId) => {
                  const size = productDetails.find(
                    (item) => item.size_id === sizeId
                  );
                  return (
                    <span
                      key={sizeId}
                      className={`product-size ${
                        selectedSize === sizeId ? "selected" : ""
                      }`}
                      onClick={() => handleSizeChange(sizeId)}
                    >
                      {size.size_name}
                    </span>
                  );
                })}
              </div>
              <div className="product-colors mt-3">
                <h5>Màu sắc:</h5>
                {getUniqueValues(productDetails, "color_id").map((colorId) => {
                  const color = productDetails.find(
                    (item) => item.color_id === colorId
                  );
                  return (
                    <span
                      key={colorId}
                      className={`product-color ${
                        selectedColor === colorId ? "selected" : ""
                      }`}
                      onClick={() => handleColorChange(colorId)}
                    >
                      {color.color_name}
                    </span>
                  );
                })}
              </div>
              <div className="inventory-quantity mt-3">
                <h5>Kho:</h5>
                <p>{inventoryQuantity}</p>
              </div>

              <div className="product-quantity mt-3">
                <h5>Số lượng:</h5>
                <div className="quantity-controls">
                  <button
                    className="quantity-button"
                    onClick={decrementQuantity}
                    disabled={quantity === 1}
                  >
                    -
                  </button>
                  <div className="quantity-display">{quantity}</div>
                  <button
                    className="quantity-button"
                    onClick={incrementQuantity}
                    disabled={quantity === inventoryQuantity}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="product-actions mt-5">
                <button
                  onClick={handleAddToCart}
                  className="action-button add-to-cart"
                >
                  <RiShoppingCartLine className="cart-icon" /> Thêm vào giỏ hàng
                </button>
                <button
                  onClick={handleBuyNow}
                  className="action-button buy-now"
                >
                  Mua ngay
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="form-container-detail mt-4">
          <h5>Mô tả sản phẩm:</h5>
          <ReactQuill
            value={productInfo.description}
            readOnly={true}
            theme="bubble"
          />
        </div>
      </div>
    </div>
  );
}
