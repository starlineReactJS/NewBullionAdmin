import { lazy } from "react";
import { PiCoinsFill } from "react-icons/pi";
import { GiBigDiamondRing } from "react-icons/gi";
import { FaHandHoldingDollar } from "react-icons/fa6";
import { LiaCitySolid } from "react-icons/lia";
const Symbol = lazy(() => import("../pages/symbol"));
const Bank = lazy(() => import("../pages/bank"));
const Coin = lazy(() => import("../pages/coin"));
const Update = lazy(() => import("../pages/update"));
const UserDetails = lazy(() => import("../pages/userdetails"));
const FeedbackList = lazy(() => import("../pages/feedback"));
const OTRList = lazy(() => import("../pages/otrlist"));
const KycPage = lazy(() => import("../pages/kyc"));
const MarketWatch = lazy(() => import("../pages/marketwatch"));
const Setting = lazy(() => import("../pages/setting"));

const ProductType = lazy(() => import("../pages/jewellery/productType"));
const Category = lazy(() => import("../pages/jewellery/category"));
const SubCategory = lazy(() => import("../pages/jewellery/subcategory"));
const Product = lazy(() => import("../pages/jewellery/product"));
const Costing = lazy(() => import("../pages/costing"));
const City = lazy(() => import("../pages/city"));


export const adminRoutesConfig = [
  {
    id: "1",
    path: "",
    title: "Manage - Symbol",
    name: "Symbol",
    display: true,
    element: <Symbol />,
    iconClass: "fa fa-diamond"
  },
  {
    id: "2",
    path: "coin",
    title: "Manage - Coin",
    name: "Coin",
    display: true,
    element: <Coin />,
    iconElement: <PiCoinsFill />
  },
  {
    id: "3",
    path: "update",
    title: "Manage - Update",
    name: "Update",
    display: true,
    element: <Update />,
    iconClass: "fa fa-comment"
  },
  {
    id: "4",
    path: "bank",
    title: "Manage - Bank",
    name: "Bank",
    display: true,
    element: <Bank />,
    iconClass: "fa fa-money"
  },
  {
    id: "5",
    path: "userdetails",
    title: "Manage - UserDetails",
    name: "UserDetails",
    display: true,
    element: <UserDetails />,
    iconClass: "fa fa-user"
  },
  {
    id: "6",
    path: "feedbacklist",
    title: "Manage - Feedback",
    name: "FeedbackList",
    display: true,
    element: <FeedbackList />,
    iconClass: "fa fa-comments"
  },
  {
    id: "7",
    path: "otr",
    title: "Manage - OTR",
    name: "OTRList",
    display: true,
    element: <OTRList />,
    iconClass: "fa fa-registered"
  },
  {
    //product type,category,sub category,product
    id: "8",
    path: "jewellery",
    name: "Jewellery",
    display: true,
    iconElement: <GiBigDiamondRing />,
    subMenu: [ 
      {
        id: "8-1",
        path: "producttype",
        title: "Manage - Type",
        name: "Type",
        display: true,
        element: <ProductType />,
      },
      {
        id: "8-2",
        path: "category",
        title: "Manage - Category",
        name: "Category",
        display: true,
        element: <Category />,
      },
      {
        id: "8-3",
        path: "subcategory",
        title: "Manage - SubCategory",
        name: "SubCategory",
        display: true,
        element: <SubCategory />,
      },
      {
        id: "8-4",
        path: "product",
        title: "Manage - Product",
        name: "Product",
        display: true,
        element: <Product />,
      },
    ],
  },
  {
    id: "9",
    path: "kyc",
    title: "Manage - Kyc",
    name:"KYC",
    display: false,
    element: <KycPage />,
    iconClass: "fa fa-address-card-o"
  },
  {
    id: "10",
    path: "marketwatch",
    title: "Manage - MarketWatch",
    name: "MarketWatch",
    display: true,
    element: <MarketWatch />,
    iconClass: "fa fa-line-chart"
  },
  {
    id: "11",
    path: "costing",
    title: "Manage - Costing",
    name: "Costing",
    display: true,
    element: <Costing />,
    iconElement: <FaHandHoldingDollar />
  },
  {
    id: "12",
    path: "city",
    title: "Manage - City",
    name: "City",
    display: true,
    element: <City />,
    iconElement: <LiaCitySolid />
  },
  {
    id: "13",
    path: "setting",
    title: "Manage - Setting",
    name: "Setting",
    display: true,
    element: <Setting />,
    iconClass: "fa fa-cog"
  },  
];