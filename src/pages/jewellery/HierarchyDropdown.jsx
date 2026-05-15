// import { useEffect, useState } from "react";
// import { getCategoryDetail } from "../../ApiServices/services";
// import { CommonForm } from "../../common/components/form";
// import { useSelector } from "react-redux";

// export default function HierarchyDropdown({ permissions, value, onChange }) {
//   const { type, category, subCategory } = permissions;
//   const {productTypes:localProductTypes,categoryTypes:localCategoryTypes,subCategoryTypes:localSubCategoryTypes} = useSelector((store) => store?.jewellery);
//   const [types, setTypes] = useState(localProductTypes ? localProductTypes:[]);
//   const [categories, setCategories] = useState(localCategoryTypes ? localCategoryTypes :[]);
//   const [subCategories, setSubCategories] = useState(localSubCategoryTypes ? localSubCategoryTypes :[]);

//   const [loading, setLoading] = useState(false);

//   /* ----------------------------------------------------
//     LOAD INITIAL DROPDOWN (SINGLE PERMISSION CASES)
//   ---------------------------------------------------- */
//   useEffect(() => {
//     setLoading(true);

//     // ONLY TYPE
//     if (type && !category && !subCategory && !localProductTypes?.length) {
//       getCategoryDetail({ level: 1 })
//         .then(res => res?.success && setTypes(res.data || []))
//         .finally(() => setLoading(false));
//       return;
//     }

//     // ONLY CATEGORY
//     if (!type && category && !subCategory && !localCategoryTypes?.length)  {
//       getCategoryDetail({ level: 2 })
//         .then(res => res?.success && setCategories(res.data || []))
//         .finally(() => setLoading(false));
//       return;
//     }

//     // ONLY SUB CATEGORY
//     if (!type && !category && subCategory && !localSubCategoryTypes?.length) {
//       getCategoryDetail({ level: 3 })
//         .then(res => res?.success && setSubCategories(res.data || []))
//         .finally(() => setLoading(false));
//       return;
//     }

//     // TYPE exists (for cascading cases)
//     if (type && !localProductTypes?.length) {
//       getCategoryDetail({ level: 1 })
//         .then(res => res?.success && setTypes(res.data || []))
//         .finally(() => setLoading(false));
//     } else {
//       setLoading(false);
//     }

//     if (!type && category && !localCategoryTypes?.length) {
//       getCategoryDetail({ level: 2 })
//         .then(res => res?.success && setCategories(res.data || []))
//         .finally(() => setLoading(false));
//       return;
//     }

//   }, [type, category, subCategory]);

//   /* ----------------------------------------------------
//      LOAD CATEGORY ON TYPE CHANGE
//   ---------------------------------------------------- */
//   useEffect(() => {
//     if (!type || !category || !value?.typeId) return;

//     setLoading(true);
//     setCategories([]);

//     getCategoryDetail({ parentId: value.typeId })
//       .then(res => res?.success && setCategories(res.data || []))
//       .finally(() => setLoading(false));
//   }, [value?.typeId, type, category]);

//   /* ----------------------------------------------------
//      LOAD SUB CATEGORY ON CATEGORY CHANGE
//   ---------------------------------------------------- */
//   useEffect(() => {
//     if (!subCategory || !value?.categoryTypeId) return;

//     setLoading(true);
//     setSubCategories([]);

//     getCategoryDetail({ parentId: value.categoryTypeId })
//       .then(res => res?.success && setSubCategories(res.data || []))
//       .finally(() => setLoading(false));
//   }, [value?.categoryTypeId, subCategory]);

//   return (
//     <>
//       {type && (
//         <CommonForm.Select
//           label="Type"
//           value={value.typeId || ""}
//           onChange={(e) =>
//             onChange({
//               typeId: e.target.value,
//               categoryTypeId: "",
//               subCategoryId: ""
//             })
//           }
//           options={
//             loading
//               ? [{ label: "Loading...", value: "" }]
//               : types.map(t => ({ label: t.name, value: t.id }))
//           }
//         />
//       )}

//       {category && (
//         <CommonForm.Select
//           label="Category"
//           value={value.categoryTypeId || ""}
//           disabled={type && !value?.typeId}
//           onChange={(e) =>
//             onChange({
//               categoryTypeId: e.target.value,
//               subCategoryId: ""
//             })
//           }
//           options={
//             loading
//               ? [{ label: "Loading...", value: "" }]
//               : categories.map(c => ({ label: c.name, value: c.id }))
//           }
//         />
//       )}

//       {subCategory && (
//         <CommonForm.Select
//           label="Sub Category"
//           value={value.subCategoryId || ""}
//           disabled={category && !value?.categoryTypeId}
//           onChange={(e) => onChange({ subCategoryId: e.target.value })}
//           options={
//             loading
//               ? [{ label: "Loading...", value: "" }]
//               : subCategories.map(sc => ({ label: sc.name, value: sc.id }))
//           }
//         />
//       )}
//     </>
//   );
// }


import { useEffect, useState } from "react";
import { getCategoryDetail } from "../../ApiServices/services";
import { CommonForm } from "../../common/components/form";
import { useSelector } from "react-redux";

export default function HierarchyDropdown({ permissions, value, onChange }) {
  const { type, category, subCategory } = permissions;

  const {
    productTypes: localProductTypes,
    categoryTypes: localCategoryTypes,
    subCategoryTypes: localSubCategoryTypes
  } = useSelector((store) => store?.jewellery);

  const [types, setTypes] = useState(localProductTypes || []);
  const [categories, setCategories] = useState(localCategoryTypes || []);
  const [subCategories, setSubCategories] = useState(localSubCategoryTypes || []);
  const [loading, setLoading] = useState(false);

  /* ----------------------------------------------------
     INITIAL DATA LOAD
  ---------------------------------------------------- */
  useEffect(() => {
    async function loadInitial() {
      try {
        setLoading(true);

        if (type && !localProductTypes?.length) {
          const res = await getCategoryDetail({ level: 1 });
          if (res?.success) setTypes(res.data || []);
        }

        if (!type && category && !localCategoryTypes?.length) {
          const res = await getCategoryDetail({ level: 2 });
          if (res?.success) setCategories(res.data || []);
        }

        if (!type && !category && subCategory && !localSubCategoryTypes?.length) {
          const res = await getCategoryDetail({ level: 3 });
          if (res?.success) setSubCategories(res.data || []);
        }

      } finally {
        setLoading(false);
      }
    }

    loadInitial();
  }, [type, category, subCategory]);

  /* ----------------------------------------------------
     LOAD CATEGORY WHEN TYPE CHANGES
  ---------------------------------------------------- */
  useEffect(() => {
    if (!type || !category || !value?.typeId) return;

    async function loadCategories() {
      try {
        setLoading(true);
        setCategories([]);

        const res = await getCategoryDetail({ parentId: value.typeId });

        if (res?.success) setCategories(res.data || []);
      } finally {
        setLoading(false);
      }
    }

    loadCategories();
  }, [value?.typeId, type, category]);

  /* ----------------------------------------------------
     LOAD SUB CATEGORY WHEN CATEGORY CHANGES
  ---------------------------------------------------- */
  useEffect(() => {
    if (!subCategory || !value?.categoryTypeId) return;

    async function loadSubCategories() {
      try {
        setLoading(true);
        setSubCategories([]);

        const res = await getCategoryDetail({ parentId: value.categoryTypeId });

        if (res?.success) setSubCategories(res.data || []);
      } finally {
        setLoading(false);
      }
    }

    loadSubCategories();
  }, [value?.categoryTypeId, subCategory]);

  const loadingOption = [{ label: "Loading...", value: "", disabled: true }];

  return (
    <>
      {type && (
        <CommonForm.Select
          label="Type"
          value={value.typeId || ""}
          onChange={(e) =>
            onChange({
              typeId: e.target.value,
              categoryTypeId: "",
              subCategoryId: ""
            })
          }
          options={
            loading
              ? loadingOption
              : types.map((t) => ({ label: t.name, value: t.id }))
          }
        />
      )}

      {category && (
        <CommonForm.Select
          label="Category"
          value={value.categoryTypeId || ""}
          disabled={type && !value?.typeId}
          onChange={(e) =>
            onChange({
              categoryTypeId: e.target.value,
              subCategoryId: ""
            })
          }
          options={
            loading
              ? loadingOption
              : categories.map((c) => ({ label: c.name, value: c.id }))
          }
        />
      )}

      {subCategory && (
        <CommonForm.Select
          label="Sub Category"
          value={value.subCategoryId || ""}
          disabled={category && !value?.categoryTypeId}
          onChange={(e) => onChange({ subCategoryId: e.target.value })}
          options={
            loading
              ? loadingOption
              : subCategories.map((sc) => ({
                  label: sc.name,
                  value: sc.id
                }))
          }
        />
      )}
    </>
  );
}