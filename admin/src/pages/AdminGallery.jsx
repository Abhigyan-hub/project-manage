import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  Eye,
  ImagePlus,
  Pencil,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import axios from "axios";
import { message } from "antd";


/*
|--------------------------------------------------------------------------
| Focus Trap
|--------------------------------------------------------------------------
*/

const useFocusTrap = (ref, isOpen) => {
  useEffect(() => {
    if (!isOpen || !ref.current) return;

    const element = ref.current;

    const focusableElements =
      element.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

    const firstFocusable =
      focusableElements[0];

    const lastFocusable =
      focusableElements[
        focusableElements.length - 1
      ];

    const handleKeyDown = (e) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (
          document.activeElement ===
          firstFocusable
        ) {
          e.preventDefault();
          lastFocusable?.focus();
        }
      } else {
        if (
          document.activeElement ===
          lastFocusable
        ) {
          e.preventDefault();
          firstFocusable?.focus();
        }
      }
    };

    element.addEventListener(
      "keydown",
      handleKeyDown
    );

    firstFocusable?.focus();

    return () => {
      element.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [ref, isOpen]);
};


/*
|--------------------------------------------------------------------------
| Admin Gallery
|--------------------------------------------------------------------------
*/

const AdminGallery = () => {
  /*
  |--------------------------------------------------------------------------
  | Album State
  |--------------------------------------------------------------------------
  */

  const [albums, setAlbums] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    fullTitle: "",
    color: "",
    images: [],
  });

  const [gradientType, setGradientType] = useState("3");

  const [gradientColors, setGradientColors] = useState([
    {
      color: "#FF9933",
      position: 0,
    },
    {
      color: "#FFFFFF",
      position: 50,
    },
    {
      color: "#138808",
      position: 100,
    },
  ]);

  const [gradientDirection, setGradientDirection] =
    useState("90");

  const [isEditing, setIsEditing] =
    useState(false);

  const [editId, setEditId] =
    useState(null);

  const [viewAlbum, setViewAlbum] =
    useState(null);

  const [
    currentImageIndex,
    setCurrentImageIndex,
  ] = useState(0);

  const [error, setError] =
    useState("");

  /*
  |--------------------------------------------------------------------------
  | Photo Management State
  |--------------------------------------------------------------------------
  */

  const [
    manageAlbum,
    setManageAlbum,
  ] = useState(null);

  const [
    selectedPhotoIndex,
    setSelectedPhotoIndex,
  ] = useState(null);

  const [
    isReplacing,
    setIsReplacing,
  ] = useState(false);

  const [
    isAddingPhotos,
    setIsAddingPhotos,
  ] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | Refs
  |--------------------------------------------------------------------------
  */

  const formRef = useRef(null);

  const fileInputRef =
    useRef(null);

  const photoInputRef =
    useRef(null);

  const replaceInputRef =
    useRef(null);

  const modalRef =
    useRef(null);

  const photoModalRef =
    useRef(null);


  /*
  |--------------------------------------------------------------------------
  | Fetch Albums
  |--------------------------------------------------------------------------
  */

  const fetchAlbums = async () => {
    try {
      const response =
        await axios.get(
          "https://ss-infotech-v2-2.onrender.com/api/albums/album-getall"
        );

      setAlbums(response.data);
    } catch (err) {
      message.error(
        "Failed to load albums. Please try again."
      );
    }
  };


  useEffect(() => {
    fetchAlbums();
  }, []);

  useEffect(() => {
      const gradient =
        generateGradientCSS();

      setFormData((prev) => ({
        ...prev,
        color: gradient,
      }));
    }, [
      gradientType,
      gradientColors,
      gradientDirection,
    ]);
  


  /*
  |--------------------------------------------------------------------------
  | ESC - Album Viewer
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const handleEscape = (e) => {
      if (
        e.key === "Escape" &&
        viewAlbum
      ) {
        closeModal();
      }
    };

    if (viewAlbum) {
      document.addEventListener(
        "keydown",
        handleEscape
      );

      document.body.style.overflow =
        "hidden";
    }

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );

      document.body.style.overflow =
        "unset";
    };
  }, [viewAlbum]);


  /*
  |--------------------------------------------------------------------------
  | Keyboard Navigation
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const handleKey = (e) => {
      if (!viewAlbum) return;

      if (e.key === "ArrowLeft") {
        prevImage();
      }

      if (e.key === "ArrowRight") {
        nextImage();
      }
    };

    if (viewAlbum) {
      document.addEventListener(
        "keydown",
        handleKey
      );

      return () =>
        document.removeEventListener(
          "keydown",
          handleKey
        );
    }
  }, [
    viewAlbum,
    currentImageIndex,
  ]);


  /*
  |--------------------------------------------------------------------------
  | Focus Traps
  |--------------------------------------------------------------------------
  */

  useFocusTrap(
    modalRef,
    !!viewAlbum
  );

  useFocusTrap(
    photoModalRef,
    !!manageAlbum
  );


  /*
  |--------------------------------------------------------------------------
  | Album Form Input
  |--------------------------------------------------------------------------
  */

  const handleInputChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const updateGradientColor = (index, value) => {
  setGradientColors((prev) =>
    prev.map((item, i) =>
      i === index
        ? {
            ...item,
            color: value,
          }
        : item
    )
  );
};


const updateGradientPosition = (
  index,
  value
) => {
  const position = Math.min(
    100,
    Math.max(0, Number(value))
  );

  setGradientColors((prev) =>
    prev.map((item, i) =>
      i === index
        ? {
            ...item,
            position,
          }
        : item
    )
  );
};


const getActiveGradientColors = () => {
  return gradientColors.slice(
    0,
    Number(gradientType)
  );
};


const generateGradientCSS = () => {
  const colors =
    getActiveGradientColors();

  if (colors.length === 1) {
    return colors[0].color;
  }

  const stops = colors
    .map(
      (item) =>
        `${item.color} ${item.position}%`
    )
    .join(", ");

  return `linear-gradient(${gradientDirection}deg, ${stops})`;
};


const generateGradientTailwind = () => {
  const colors =
    getActiveGradientColors();

  if (colors.length === 1) {
    return "bg-[#" +
      colors[0].color.replace("#", "") +
      "]";
  }

  return generateGradientCSS();
};


const applyGradientToForm = () => {
  const gradient =
    generateGradientCSS();

  setFormData((prev) => ({
    ...prev,
    color: gradient,
  }));
};


  /*
  |--------------------------------------------------------------------------
  | Album File Change
  |--------------------------------------------------------------------------
  */

  const handleFileChange = (e) => {
    const files = Array.from(
      e.target.files
    );

    if (files.length > 10) {
      setError(
        "Maximum 10 images allowed"
      );

      message.error(
        "Maximum 10 images allowed"
      );

      return;
    }

    if (
      !isEditing &&
      files.length < 5
    ) {
      setError(
        "Minimum 5 images required for new albums"
      );

      message.error(
        "Minimum 5 images required for new albums"
      );

      return;
    }

    setFormData((prev) => ({
      ...prev,
      images: files,
    }));

    setError("");
  };


  /*
  |--------------------------------------------------------------------------
  | Create / Update Album
  |--------------------------------------------------------------------------
  */

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    data.append(
      "title",
      formData.title
    );

    data.append(
      "fullTitle",
      formData.fullTitle
    );

    data.append(
      "color",
      formData.color
    );

    formData.images.forEach(
      (file) => {
        data.append(
          "images",
          file
        );
      }
    );

    try {
      if (isEditing) {
        const response =
          await axios.patch(
            `https://ss-infotech-v2-2.onrender.com/api/albums/album/${editId}`,
            data,
            {
              headers: {
                "Content-Type":
                  "multipart/form-data",
              },
            }
          );

        setAlbums((prev) =>
          prev.map((album) =>
            album._id === editId
              ? response.data.album
              : album
          )
        );

        message.success(
          "Album updated successfully!"
        );
      } else {
        const response =
          await axios.post(
            "https://ss-infotech-v2-2.onrender.com/api/albums/album-post",
            data,
            {
              headers: {
                "Content-Type":
                  "multipart/form-data",
              },
            }
          );

        setAlbums((prev) => [
          response.data.album,
          ...prev,
        ]);

        message.success(
          "Album created successfully!"
        );
      }

      resetAlbumForm();
    } catch (err) {
      const errMsg =
        err.response?.data?.error ||
        "Failed to save album";

      setError(errMsg);
      message.error(errMsg);
    }
  };


  /*
  |--------------------------------------------------------------------------
  | Reset Album Form
  |--------------------------------------------------------------------------
  */

  const resetAlbumForm = () => {
    setFormData({
      title: "",
      fullTitle: "",
      color: "",
      images: [],
    });

    setIsEditing(false);
    setEditId(null);
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value =
        "";
    }
  };


  /*
  |--------------------------------------------------------------------------
  | Edit Album
  |--------------------------------------------------------------------------
  */

  const handleEdit = (album) => {
    setIsEditing(true);

    setEditId(album._id);

    setFormData({
      title: album.title,
      fullTitle: album.fullTitle,
      color: album.color,
      images: [],
    });

    setError("");

    message.info(
      `Editing album: ${album.title}`
    );

    formRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };


  /*
  |--------------------------------------------------------------------------
  | Delete Album
  |--------------------------------------------------------------------------
  */

  const handleDelete = async (_id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this album and all its photos?"
      )
    ) {
      return;
    }

    try {
      await axios.delete(
        `https://ss-infotech-v2-2.onrender.com/api/albums/album/${_id}`
      );

      setAlbums((prev) =>
        prev.filter(
          (album) =>
            album._id !== _id
        )
      );

      if (
        manageAlbum?._id === _id
      ) {
        setManageAlbum(null);
      }

      message.success(
        "Album deleted successfully!"
      );
    } catch (err) {
      const errMsg =
        err.response?.data?.error ||
        "Failed to delete album";

      setError(errMsg);

      message.error(errMsg);
    }
  };


  /*
  |--------------------------------------------------------------------------
  | Open Album Viewer
  |--------------------------------------------------------------------------
  */

  const openModal = (
    album,
    index = 0
  ) => {
    setViewAlbum(album);
    setCurrentImageIndex(index);
  };


  const closeModal = () => {
    setViewAlbum(null);
    setCurrentImageIndex(0);
  };


  /*
  |--------------------------------------------------------------------------
  | Viewer Navigation
  |--------------------------------------------------------------------------
  */

  const nextImage = () => {
    if (
      !viewAlbum ||
      !viewAlbum.images.length
    ) {
      return;
    }

    setCurrentImageIndex(
      (i) =>
        (i + 1) %
        viewAlbum.images.length
    );
  };


  const prevImage = () => {
    if (
      !viewAlbum ||
      !viewAlbum.images.length
    ) {
      return;
    }

    setCurrentImageIndex(
      (i) =>
        (i -
          1 +
          viewAlbum.images.length) %
        viewAlbum.images.length
    );
  };


  /*
  |--------------------------------------------------------------------------
  | Open Photo Manager
  |--------------------------------------------------------------------------
  */

  const openPhotoManager = (
    album
  ) => {
    setManageAlbum(album);

    setSelectedPhotoIndex(
      null
    );

    setIsReplacing(false);
    setIsAddingPhotos(false);
  };


  const closePhotoManager = () => {
    setManageAlbum(null);

    setSelectedPhotoIndex(
      null
    );

    setIsReplacing(false);
    setIsAddingPhotos(false);

    if (photoInputRef.current) {
      photoInputRef.current.value =
        "";
    }

    if (
      replaceInputRef.current
    ) {
      replaceInputRef.current.value =
        "";
    }
  };


  /*
  |--------------------------------------------------------------------------
  | Add Photos
  |--------------------------------------------------------------------------
  */

  const handleAddPhotos = async (
    e
  ) => {
    const files = Array.from(
      e.target.files
    );

    if (!files.length) {
      return;
    }

    const currentCount =
      manageAlbum.images.length;

    if (
      currentCount +
        files.length >
      10
    ) {
      message.error(
        `Maximum 10 photos allowed. You currently have ${currentCount}.`
      );

      return;
    }

    const data = new FormData();

    files.forEach((file) => {
      data.append(
        "images",
        file
      );
    });

    try {
      setIsAddingPhotos(true);

      const response =
        await axios.post(
          `https://ss-infotech-v2-2.onrender.com/api/albums/album/${manageAlbum._id}/images`,
          data,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

      const updatedAlbum =
        response.data.album;

      setManageAlbum(
        updatedAlbum
      );

      setAlbums((prev) =>
        prev.map((album) =>
          album._id ===
          updatedAlbum._id
            ? updatedAlbum
            : album
        )
      );

      message.success(
        "Photos added successfully!"
      );
    } catch (err) {
      message.error(
        err.response?.data?.error ||
          "Failed to add photos"
      );
    } finally {
      setIsAddingPhotos(false);

      if (photoInputRef.current) {
        photoInputRef.current.value =
          "";
      }
    }
  };


  /*
  |--------------------------------------------------------------------------
  | Replace Photo
  |--------------------------------------------------------------------------
  */

  const handleReplacePhoto = async (
    e
  ) => {
    const file =
      e.target.files?.[0];

    if (
      !file ||
      selectedPhotoIndex === null
    ) {
      return;
    }

    const data = new FormData();

    data.append(
      "image",
      file
    );

    try {
      setIsReplacing(true);

      const response =
        await axios.patch(
          `https://ss-infotech-v2-2.onrender.com/api/albums/album/${manageAlbum._id}/images/${selectedPhotoIndex}`,
          data,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

      const updatedAlbum =
        response.data.album;

      setManageAlbum(
        updatedAlbum
      );

      setAlbums((prev) =>
        prev.map((album) =>
          album._id ===
          updatedAlbum._id
            ? updatedAlbum
            : album
        )
      );

      message.success(
        "Photo replaced successfully!"
      );
    } catch (err) {
      message.error(
        err.response?.data?.error ||
          "Failed to replace photo"
      );
    } finally {
      setIsReplacing(false);
      setSelectedPhotoIndex(
        null
      );

      if (
        replaceInputRef.current
      ) {
        replaceInputRef.current.value =
          "";
      }
    }
  };


  /*
  |--------------------------------------------------------------------------
  | Delete Individual Photo
  |--------------------------------------------------------------------------
  */

  const handleDeletePhoto = async (
    index
  ) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this photo?"
      )
    ) {
      return;
    }

    try {
      const response =
        await axios.delete(
          `https://ss-infotech-v2-2.onrender.com/api/albums/album/${manageAlbum._id}/images/${index}`
        );

      const updatedAlbum =
        response.data.album;

      setManageAlbum(
        updatedAlbum
      );

      setAlbums((prev) =>
        prev.map((album) =>
          album._id ===
          updatedAlbum._id
            ? updatedAlbum
            : album
        )
      );

      /*
       * Update viewer if open
       */

      if (
        viewAlbum?._id ===
        updatedAlbum._id
      ) {
        setViewAlbum(
          updatedAlbum
        );

        if (
          currentImageIndex >=
          updatedAlbum.images.length
        ) {
          setCurrentImageIndex(
            Math.max(
              0,
              updatedAlbum.images.length -
                1
            )
          );
        }
      }

      message.success(
        "Photo deleted successfully!"
      );
    } catch (err) {
      message.error(
        err.response?.data?.error ||
          "Failed to delete photo"
      );
    }
  };


  /*
  |--------------------------------------------------------------------------
  | Overlay Click
  |--------------------------------------------------------------------------
  */

  const handleOverlayClick = (
    e
  ) => {
    if (
      e.target ===
      e.currentTarget
    ) {
      closeModal();
    }
  };


  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  return (
    <div className="min-h-screen bg-gray-100">

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ================================================================
            CREATE / EDIT ALBUM
        ================================================================= */}

        <section
          ref={formRef}
          className="mb-12 bg-white rounded-2xl shadow-md p-6"
        >

          <div className="flex items-center justify-between mb-6">

            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {isEditing
                  ? "Update Album"
                  : "Create New Album"}
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                {isEditing
                  ? "Update album information or add photos."
                  : "Create an album with 5–10 photos."}
              </p>
            </div>

          </div>


          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* Title */}

            {/* Album Basic Information + Images */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#552586] focus:border-transparent outline-none"
                  required
                />
              </div>

              {/* Full Title */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Full Title
                </label>

                <input
                  type="text"
                  name="fullTitle"
                  value={formData.fullTitle}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#552586] focus:border-transparent outline-none"
                  required
                />
              </div>

              {/* Images */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {isEditing ? "Add Images" : "Images (5–10)"}
                </label>

                <input
                  type="file"
                  name="images"
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-xs bg-white"
                  required={!isEditing}
                />
              </div>

            </div>


            {/* Color */}

         {/* ================================================================
                GRADIENT BUILDER
            ================================================================= */}

            <div>

              <div className="flex items-center justify-between mb-4">

                <div>
                  <label className="block text-sm font-semibold text-gray-800">
                    Album Color / Gradient
                  </label>

                  <p className="text-xs text-gray-500 mt-1">
                    Choose 1, 2 or 3 colors and control their positions.
                  </p>
                </div>

              </div>


              {/* ================================================================
                  COLOR COUNT
              ================================================================= */}

              <div className="flex flex-wrap items-end gap-4 mb-4">

                {/* Number of Colors */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Colors
                  </label>

                  <div className="flex gap-1">
                    {["1", "2", "3"].map((count) => (
                      <button
                        key={count}
                        type="button"
                        onClick={() => setGradientType(count)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition ${
                          gradientType === count
                            ? "bg-[#552586] text-white border-[#552586]"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {count}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Direction */}
                {gradientType !== "1" && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Direction
                    </label>

                    <select
                      value={gradientDirection}
                      onChange={(e) => setGradientDirection(e.target.value)}
                      className="w-36 px-3 py-1.5 border border-gray-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#552586]"
                    >
                      <option value="0">Top → Bottom</option>
                      <option value="45">Diagonal ↗</option>
                      <option value="90">Left → Right</option>
                      <option value="135">Diagonal ↘</option>
                      <option value="180">Bottom → Top</option>
                      <option value="270">Right → Left</option>
                    </select>
                  </div>
                )}

              </div>


              {/* ================================================================
                  COLOR CONTROLS
              ================================================================= */}

              <div className="flex flex-wrap items-center gap-3">

                {getActiveGradientColors().map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                  >

                    {/* Color Number */}
                    <span className="text-xs font-semibold text-gray-700 whitespace-nowrap">
                      C{index + 1}
                    </span>

                    {/* Color Picker */}
                    <input
                      type="color"
                      value={item.color}
                      onChange={(e) =>
                        updateGradientColor(index, e.target.value)
                      }
                      className="w-8 h-8 rounded-md border border-gray-300 cursor-pointer p-0.5 bg-white"
                    />

                    {/* HEX */}
                    <input
                      type="text"
                      value={item.color}
                      onChange={(e) =>
                        updateGradientColor(index, e.target.value)
                      }
                      className="w-20 px-2 py-1.5 border border-gray-300 rounded-md uppercase text-xs font-medium"
                    />

                    {/* Position */}
                    {gradientType !== "1" && (
                      <>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={item.position}
                          onChange={(e) =>
                            updateGradientPosition(
                              index,
                              e.target.value
                            )
                          }
                          className="w-14 px-2 py-1.5 border border-gray-300 rounded-md text-center text-xs"
                        />

                        <span className="text-xs text-gray-500">
                          %
                        </span>
                      </>
                    )}

                  </div>
                ))}

              </div>


              {/* ================================================================
                  LIVE PREVIEW
              ================================================================= */}

              {/* Live Preview + CSS Output */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">

                {/* Live Preview */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold text-gray-800">
                      Live Preview
                    </p>

                    <span className="text-[10px] text-green-600 font-medium">
                      ● Live
                    </span>
                  </div>

                  <div
                    className="w-full h-20 rounded-xl border border-gray-200 shadow-inner"
                    style={{
                      background: generateGradientCSS(),
                    }}
                  />
                </div>

                {/* Generated CSS */}
                <div>
                  <p className="text-xs font-semibold text-gray-800 mb-2">
                    Generated CSS
                  </p>

                  <div className="h-20 flex items-center px-3 py-2 rounded-xl bg-gray-900 text-green-400 text-xs break-all font-mono overflow-auto">
                    {generateGradientCSS()}
                  </div>
                </div>

              </div>


              {/* ================================================================
                  GENERATED VALUE
              ================================================================= */}

              <div className="mt-4">

                <p className="text-sm font-medium text-gray-700 mb-2">
                  Generated CSS
                </p>

                <div className="p-3 rounded-xl bg-gray-900 text-green-400 text-xs sm:text-sm break-all font-mono">
                  {generateGradientCSS()}
                </div>

              </div>


              {/* ================================================================
                  SAVE COLOR
              ================================================================= */}

              <button
                type="button"
                onClick={applyGradientToForm}
                className="mt-4 px-5 py-3 bg-[#552586] hover:bg-[#6a34a0] text-white rounded-xl font-medium transition"
              >
                Apply Gradient
              </button>


              {/* Current saved value */}

              {formData.color && (

                <div className="mt-3">

                  <p className="text-xs text-gray-500 mb-1">
                    Value that will be saved:
                  </p>

                  <p className="text-xs font-mono bg-gray-100 p-3 rounded-lg break-all">
                    {formData.color}
                  </p>

                </div>

              )}

            </div>


            {/* Images */}

            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {isEditing
                  ? "Add Images"
                  : "Images (5–10)"}
              </label>

              <input
                type="file"
                name="images"
                multiple
                accept="image/jpeg,image/png,image/webp"
                onChange={
                  handleFileChange
                }
                ref={fileInputRef}
                className="w-full p-3 border border-gray-300 rounded-xl"
                required={
                  !isEditing
                }
              />
            </div> */}


            {error && (
              <p className="text-red-600 text-sm">
                {error}
              </p>
            )}


            <div className="flex gap-3">

              <button
                type="submit"
                className="px-6 py-3 bg-[#552586] text-white rounded-xl hover:bg-[#6a34a0] transition"
              >
                {isEditing
                  ? "Update Album"
                  : "Create Album"}
              </button>


              {isEditing && (
                <button
                  type="button"
                  onClick={
                    resetAlbumForm
                  }
                  className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
              )}

            </div>

          </form>
        </section>


        {/* ================================================================
            ALBUM LIST
        ================================================================= */}

        <section className="bg-white rounded-2xl shadow-md p-6">

          <div className="flex items-center justify-between mb-6">

            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Albums
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Manage albums and individual photos.
              </p>
            </div>

            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
              {albums.length} Albums
            </span>

          </div>


          {albums.length === 0 ? (
            <p className="text-gray-500">
              No albums found.
            </p>
          ) : (

            <div className="overflow-x-auto">

              <table className="min-w-full">

                <thead className="bg-gray-50">

                  <tr>

                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                      Album
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                      Full Title
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                      Images
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                      Actions
                    </th>

                  </tr>

                </thead>


                <tbody className="divide-y divide-gray-200">

                  {albums.map(
                    (album) => (

                      <tr
                        key={
                          album._id
                        }
                        className="hover:bg-gray-50"
                      >

                        {/* Album */}

                        <td className="px-6 py-5">

                          <div className="flex items-center gap-4">

                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100">

                              {album.images?.[0] && (
                                <img
                                  src={
                                    album.images[0]
                                  }
                                  alt={
                                    album.title
                                  }
                                  className="w-full h-full object-cover"
                                />
                              )}

                            </div>

                            <div>

                              <p className="font-semibold text-gray-900">
                                {
                                  album.title
                                }
                              </p>

                              <p className="text-xs text-gray-500">
                                ID:{" "}
                                {
                                  album._id
                                }
                              </p>

                            </div>

                          </div>

                        </td>


                        {/* Full Title */}

                        <td className="px-6 py-5 text-gray-600">
                          {
                            album.fullTitle
                          }
                        </td>


                        {/* Images */}

                        <td className="px-6 py-5">

                          <span className="inline-flex px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-semibold">
                            {
                              album.images
                                ?.length ||
                              0
                            }{" "}
                            Photos
                          </span>

                        </td>


                        {/* Actions */}

                        <td className="px-6 py-5">

                          <div className="flex flex-wrap gap-2">

                            <button
                              onClick={() =>
                                openModal(
                                  album
                                )
                              }
                              className="px-3 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm"
                            >
                              <Eye size={16}/>
                            </button>


                            <button
                              onClick={() =>
                                openPhotoManager(
                                  album
                                )
                              }
                              className="px-3 py-2 rounded-lg bg-purple-100 text-purple-700 hover:bg-purple-200 text-sm font-medium"
                            >
                              <ImagePlus size={16} />
                            </button>


                            <button
                              onClick={() =>
                                handleEdit(
                                  album
                                )
                              }
                              className="px-3 py-2 rounded-lg bg-yellow-100 text-yellow-700 hover:bg-yellow-200 text-sm"
                            >
                              <Pencil size={16} />
                            </button>


                            <button
                              onClick={() =>
                                handleDelete(
                                  album._id
                                )
                              }
                              className="px-3 py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 text-sm"
                            >
                              <Trash2 size={16} />
                            </button>

                          </div>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </section>

      </main>


      {/* ================================================================
          PHOTO MANAGEMENT MODAL
      ================================================================= */}

      <AnimatePresence>

        {manageAlbum && (

          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
          >

            <motion.div
              ref={
                photoModalRef
              }
              initial={{
                scale: 0.95,
                opacity: 0,
              }}
              animate={{
                scale: 1,
                opacity: 1,
              }}
              exit={{
                scale: 0.95,
                opacity: 0,
              }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden"
            >

              {/* Header */}

              <div className="flex items-center justify-between p-6 border-b">

                <div>

                  <h2 className="text-2xl font-bold text-gray-900">
                    Manage Photos
                  </h2>

                  <p className="text-gray-500 text-sm mt-1">
                    {
                      manageAlbum.fullTitle
                    }
                  </p>

                </div>


                <div className="flex items-center gap-3">

                  <span className="px-3 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-semibold">
                    {
                      manageAlbum
                        .images
                        .length
                    }
                    /10 Photos
                  </span>


                  <button
                    onClick={
                      closePhotoManager
                    }
                    className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200"
                  >
                    ✕
                  </button>

                </div>

              </div>


              {/* Content */}

              <div className="p-6 overflow-y-auto max-h-[calc(95vh-100px)]">

                {/* Top Controls */}

                <div className="flex flex-wrap gap-3 mb-6">

                  <label className="cursor-pointer">

                    <input
                      ref={
                        photoInputRef
                      }
                      type="file"
                      multiple
                      accept="image/jpeg,image/png,image/webp"
                      onChange={
                        handleAddPhotos
                      }
                      className="hidden"
                      disabled={
                        isAddingPhotos ||
                        manageAlbum
                          .images
                          .length >=
                          10
                      }
                    />

                    <span
                      className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl text-white font-medium ${
                        manageAlbum
                          .images
                          .length >=
                        10
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-[#552586] hover:bg-[#6a34a0]"
                      }`}
                    >
                      {isAddingPhotos
                        ? "Adding..."
                        : "+ Add Photos"}
                    </span>

                  </label>


                  <div className="text-sm text-gray-500 flex items-center">
                    Maximum 10 photos per album
                  </div>

                </div>


                {/* ======================================================
                    Photo Grid
                ======================================================= */}

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">

                  {manageAlbum.images.map(
                    (
                      image,
                      index
                    ) => (

                      <motion.div
                        key={`${image}-${index}`}
                        initial={{
                          opacity: 0,
                          y: 10,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        className="group relative rounded-2xl overflow-hidden bg-gray-100 border border-gray-200"
                      >

                        {/* Image */}

                        <button
                          type="button"
                          onClick={() =>
                            openModal(
                              manageAlbum,
                              index
                            )
                          }
                          className="block w-full"
                        >

                          <img
                            src={image}
                            alt={`Photo ${
                              index + 1
                            }`}
                            className="w-full aspect-square object-cover group-hover:scale-105 transition duration-300"
                          />

                        </button>


                        {/* Number */}

                        <div className="absolute top-2 left-2">

                          <span className="px-2 py-1 rounded-lg bg-black/70 text-white text-xs">
                            #
                            {index +
                              1}
                          </span>

                        </div>


                        {/* Actions */}

                        <div className="p-3 bg-white">

                          <div className="flex gap-2">

                            {/* Replace */}

                            <label className="flex-1 cursor-pointer">

                              <input
                                ref={
                                  selectedPhotoIndex ===
                                  index
                                    ? replaceInputRef
                                    : null
                                }
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={
                                  handleReplacePhoto
                                }
                                onClick={() =>
                                  setSelectedPhotoIndex(
                                    index
                                  )
                                }
                                className="hidden"
                              />

                              <span className="flex items-center justify-center px-2 py-2 rounded-lg bg-yellow-100 text-yellow-700 hover:bg-yellow-200 text-xs font-medium">
                                Replace
                              </span>

                            </label>


                            {/* Delete */}

                            <button
                              type="button"
                              onClick={() =>
                                handleDeletePhoto(
                                  index
                                )
                              }
                              className="flex-1 px-2 py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 text-xs font-medium"
                            >
                              Delete
                            </button>

                          </div>

                        </div>

                      </motion.div>

                    )
                  )}

                </div>


                {/* Empty */}

                {manageAlbum.images
                  .length === 0 && (

                  <div className="text-center py-20">

                    <div className="text-5xl mb-4">
                      🖼️
                    </div>

                    <h3 className="text-xl font-semibold text-gray-800">
                      No photos
                    </h3>

                    <p className="text-gray-500 mt-2">
                      Add photos to this album.
                    </p>

                  </div>

                )}


                {/* ======================================================
                    LIVE PREVIEW
                ======================================================= */}

                <div className="mt-10 pt-8 border-t">

                  <div className="flex items-center justify-between mb-5">

                    <div>

                      <h3 className="text-xl font-bold text-gray-900">
                        Live Album Preview
                      </h3>

                      <p className="text-sm text-gray-500">
                        This is how the current album photos will appear.
                      </p>

                    </div>


                    <button
                      onClick={() =>
                        openModal(
                          manageAlbum,
                          0
                        )
                      }
                      className="px-4 py-2 rounded-xl bg-gray-900 text-white text-sm hover:bg-gray-800"
                    >
                      Open Full Preview
                    </button>

                  </div>


                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                    {manageAlbum.images
                      .slice(0, 4)
                      .map(
                        (
                          image,
                          index
                        ) => (

                          <button
                            key={image}
                            type="button"
                            onClick={() =>
                              openModal(
                                manageAlbum,
                                index
                              )
                            }
                            className="relative aspect-video rounded-2xl overflow-hidden group"
                          >

                            <img
                              src={image}
                              alt={`Preview ${
                                index +
                                1
                              }`}
                              className="w-full h-full object-cover group-hover:scale-105 transition"
                            />

                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition" />

                          </button>

                        )
                      )}

                  </div>

                </div>

              </div>

            </motion.div>

          </motion.div>

        )}

      </AnimatePresence>


      {/* ================================================================
          FULL ALBUM VIEWER
      ================================================================= */}

      <AnimatePresence>

        {viewAlbum && (

          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={
              handleOverlayClick
            }
          >

            <motion.div
              ref={modalRef}
              initial={{
                scale: 0.95,
                opacity: 0,
              }}
              animate={{
                scale: 1,
                opacity: 1,
              }}
              exit={{
                scale: 0.95,
                opacity: 0,
              }}
              className="relative bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden"
            >

              {/* Header */}

              <div className="flex items-center justify-between p-5 border-b">

                <div>

                  <h3 className="text-xl font-bold">
                    {
                      viewAlbum.fullTitle
                    }
                  </h3>

                  <p className="text-sm text-gray-500">
                    Photo{" "}
                    {currentImageIndex +
                      1}{" "}
                    of{" "}
                    {
                      viewAlbum
                        .images
                        .length
                    }
                  </p>

                </div>


                <button
                  onClick={
                    closeModal
                  }
                  className="p-2 hover:bg-gray-200 rounded-full"
                >
                  ✕
                </button>

              </div>


              {/* Image */}

              <div className="p-6">

                <div className="relative bg-gray-100 rounded-2xl overflow-hidden">

                  <motion.img
                    key={
                      currentImageIndex
                    }
                    initial={{
                      opacity: 0,
                    }}
                    animate={{
                      opacity: 1,
                    }}
                    src={
                      viewAlbum
                        .images[
                        currentImageIndex
                      ]
                    }
                    alt="album"
                    className="w-full h-[65vh] object-contain"
                  />


                  {/* Previous */}

                  <button
                    onClick={
                      prevImage
                    }
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-lg text-3xl"
                  >
                    ‹
                  </button>


                  {/* Next */}

                  <button
                    onClick={
                      nextImage
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-lg text-3xl"
                  >
                    ›
                  </button>

                </div>


                {/* Thumbnails */}

                <div className="flex gap-2 mt-4 overflow-x-auto pb-2">

                  {viewAlbum.images.map(
                    (
                      image,
                      index
                    ) => (

                      <button
                        key={`${image}-${index}`}
                        onClick={() =>
                          setCurrentImageIndex(
                            index
                          )
                        }
                        className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 ${
                          currentImageIndex ===
                          index
                            ? "border-[#552586]"
                            : "border-transparent"
                        }`}
                      >

                        <img
                          src={image}
                          alt={`Thumbnail ${
                            index +
                            1
                          }`}
                          className="w-full h-full object-cover"
                        />

                      </button>

                    )
                  )}

                </div>

              </div>

            </motion.div>

          </motion.div>

        )}

      </AnimatePresence>

    </div>
  );
};

export default AdminGallery;