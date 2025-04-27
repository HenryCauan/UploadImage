"use client";
import { useState, useEffect } from "react"
import Link from 'next/link';

export default function Upload() {
  const [light, setLight] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);

  useEffect(() => {
    // Verifica se a página está sendo recarregada
    const handleBeforeUnload = (event) => {
      window.location.href = '/';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Recupera a imagem do localStorage
    const storedImage = localStorage.getItem('uploadedImage');
    if (storedImage) {
      setUploadedImage(JSON.parse(storedImage));
      // Limpa o localStorage após usar
      localStorage.removeItem('uploadedImage');
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const handleClick = () => {
    setLight(!light);
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target.result.split(',')[1]; // Remove o prefixo "data:image/..."
        setUploadedImage({
          name: file.name,
          type: file.type,
          base64: base64,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleShare = () => {
    if (uploadedImage?.base64) {
      const imageUrl = `data:${uploadedImage.type};base64,${uploadedImage.base64}`;
      const blob = base64ToBlob(uploadedImage.base64, uploadedImage.type);
      const url = URL.createObjectURL(blob);

      navigator.clipboard.writeText(url)
        .then(() => {
          alert('URL da imagem copiada para a área de transferência!');
        })
        .catch((err) => {
          console.error('Erro ao copiar a URL:', err);
          alert('Erro ao copiar a URL. Tente novamente.');
        });
    } else {
      alert('Nenhuma imagem carregada para compartilhar.');
    }
  };

  // Função auxiliar para converter base64 em Blob
  const base64ToBlob = (base64, contentType) => {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
  };

  const handleDownload = () => {
    if (uploadedImage?.base64) {
      const link = document.createElement('a');
      link.href = `data:${uploadedImage.type};base64,${uploadedImage.base64}`;
      link.download = uploadedImage.name || 'imagem';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert('Nenhuma imagem carregada para baixar.');
    }
  };

  return (
    <>
      <div className={`flex flex-col w-screen h-dvh ${light ? 'bg-[color:#f9fafc] text-gray-800' : 'bg-[color:#121826] text-white'} overflow-hidden`}>
        <nav className={`flex justify-between px-4 sm:px-10 py-7 items-center border-b ${light ? 'border-[#E5E7EB]' : 'border-[#4D5562]'} `}>
            <Link href="/">
              <div className="flex gap-2 items-center font-semibold">
                <svg width="30" height="30" viewBox="0 0 22 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path opacity="0.6" d="M0 2C0 0.895431 0.895431 0 2 0H14C15.1046 0 16 0.895431 16 2V14C16 15.1046 15.1046 16 14 16H2C0.895431 16 0 15.1046 0 14V2Z" fill="#9DC4F8" />
                  <path d="M6 6C6 4.89543 6.89543 4 8 4H20C21.1046 4 22 4.89543 22 6V18C22 19.1046 21.1046 20 20 20H8C6.89543 20 6 19.1046 6 18V6Z" fill="#3662E3" />
                  <path d="M10.2927 14.707C10.3855 14.7999 10.4957 14.8736 10.617 14.9238C10.7384 14.9741 10.8684 15 10.9997 15C11.131 15 11.2611 14.9741 11.3824 14.9238C11.5037 14.8736 11.6139 14.7999 11.7067 14.707L12.9997 13.4141L12.9997 25C12.9997 25.2652 13.105 25.5196 13.2926 25.7071C13.4801 25.8946 13.7345 26 13.9997 26C14.2649 26 14.5192 25.8946 14.7068 25.7071C14.8943 25.5196 14.9997 25.2652 14.9997 25L14.9997 13.4141L16.2927 14.707C16.4808 14.8917 16.7342 14.9947 16.9978 14.9935C17.2614 14.9923 17.5139 14.887 17.7003 14.7006C17.8867 14.5142 17.992 14.2617 17.9932 13.9981C17.9943 13.7345 17.8914 13.4811 17.7067 13.293L14.7067 10.293C14.6138 10.2001 14.5036 10.1264 14.3823 10.0762C14.261 10.0259 14.131 10 13.9996 10C13.8683 10 13.7383 10.0259 13.617 10.0762C13.4957 10.1264 13.3855 10.2001 13.2926 10.293L10.2926 13.293C10.1998 13.3858 10.1261 13.4961 10.0758 13.6174C10.0256 13.7387 9.9997 13.8687 9.9997 14C9.99971 14.1313 10.0256 14.2613 10.0759 14.3827C10.1261 14.504 10.1998 14.6142 10.2927 14.707V14.707Z" fill="#C2DAF9" />
                </svg>
                ImageUpload</div>
            </Link>
          <div id="moon" className={`px-2 py-2 ${light ? 'bg-white border-[color:#E5E7EB]' : 'bg-[color:#212936] border-[#4D5562]'} rounded-lg border-1 cursor-pointer`} onClick={handleClick}>
            {light ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M15 4C15.292 4 15.438 4 15.5781 4.04183C16.192 4.22522 16.4775 4.93111 16.1637 5.48976C16.0921 5.61719 15.8744 5.82779 15.4389 6.249C13.935 7.70352 13 9.74257 13 12C13 14.2574 13.935 16.2965 15.4389 17.751C15.8744 18.1722 16.0921 18.3828 16.1637 18.5102C16.4775 19.0689 16.192 19.7748 15.5781 19.9582C15.438 20 15.292 20 15 20V20C10.5817 20 7 16.4183 7 12C7 7.58172 10.5817 4 15 4V4Z" fill="#3662E3" />
              </svg>
            ) : (

              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="4" fill="#F9FAFB" fillOpacity="0.8" />
                <path d="M12 5V3" stroke="#F9FAFB" strokeOpacity="0.8" strokeWidth="2" strokeLinecap="round" />
                <path d="M12 21V19" stroke="#F9FAFB" strokeOpacity="0.8" strokeWidth="2" strokeLinecap="round" />
                <path d="M16.95 7.04996L18.3643 5.63574" stroke="#F9FAFB" strokeOpacity="0.8" strokeWidth="2" strokeLinecap="round" />
                <path d="M5.63608 18.3644L7.05029 16.9502" stroke="#F9FAFB" strokeOpacity="0.8" strokeWidth="2" strokeLinecap="round" />
                <path d="M19 12L21 12" stroke="#F9FAFB" strokeOpacity="0.8" strokeWidth="2" strokeLinecap="round" />
                <path d="M3 12L5 12" stroke="#F9FAFB" strokeOpacity="0.8" strokeWidth="2" strokeLinecap="round" />
                <path d="M16.95 16.95L18.3643 18.3643" stroke="#F9FAFB" strokeOpacity="0.8" strokeWidth="2" strokeLinecap="round" />
                <path d="M5.63608 5.63559L7.05029 7.0498" stroke="#F9FAFB" strokeOpacity="0.8" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </div>
        </nav>
        <main className="w-full h-full flex justify-center items-center relative select-none">
          <div className={`w-[88vw] h-[52vh] box-shadown absolute sm:w-[47rem] sm:h-[32rem] ${light ? 'bg-white' : 'bg-[color:#212936]'} rounded-lg shadow-md`}></div>
          {uploadedImage ? (
            <div className={`w-[85vw] h-[50vh] sm:w-[45rem] sm:h-[30rem] ${light ? 'bg-white' : 'bg-[color:#212936]'} p-4 rounded-lg flex flex-col justify-center items-center gap-2 z-20 relative`}>
              {uploadedImage.base64 ? (
                <img
                  src={`data:${uploadedImage.type};base64,${uploadedImage.base64}`}
                  alt={uploadedImage.name}
                  className="max-w-full max-h-full"
                />
              ) : (
                <p className={`${light ? 'text-black' : 'text-white'} font-semibold`}>Imagem não carregada corretamente.</p>
              )}
              <p className={`${light ? 'text-black' : 'text-white'} font-semibold`}>{uploadedImage.name}</p>
            </div>
          ) : (
            <div className={`w-[85vw] h-[50vh] sm:w-[45rem] sm:h-[30rem] ${light ? 'bg-white border-[color:#E5E7EB]' : 'bg-[color:#212936] border-[#4D5562]'} p-4 border-2 border-dashed rounded-lg flex flex-col justify-center items-center gap-2 z-20 relative`}>
              <svg width="32" height="50" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.0571 11.0574L9.72378 16.3907C9.4775 16.6415 9.34022 16.9794 9.34181 17.3309C9.3434 17.6823 9.48374 18.019 9.73228 18.2675C9.98082 18.5161 10.3175 18.6564 10.6689 18.658C11.0204 18.6596 11.3583 18.5223 11.6091 18.276L14.6664 15.2188L14.6664 26.6667L17.3331 26.6667L17.3331 15.2188L20.3904 18.2761C20.514 18.4012 20.661 18.5006 20.8231 18.5686C20.9852 18.6367 21.1591 18.672 21.3349 18.6725C21.5107 18.6731 21.6848 18.6388 21.8473 18.5718C22.0098 18.5048 22.1575 18.4063 22.2818 18.282C22.4061 18.1577 22.5046 18.0101 22.5716 17.8475C22.6386 17.685 22.6728 17.5109 22.6722 17.3351C22.6717 17.1593 22.6364 16.9854 22.5683 16.8233C22.5003 16.6612 22.4009 16.5142 22.2758 16.3907L16.9424 11.0574C16.8187 10.9335 16.6717 10.8353 16.51 10.7683C16.3482 10.7013 16.1749 10.6668 15.9998 10.6668C15.8247 10.6668 15.6513 10.7013 15.4896 10.7683C15.3278 10.8353 15.1809 10.9335 15.0571 11.0574Z" fill="#3662E3" />
                <path d="M2.6665 9.33335L2.6665 22.6667C2.66766 23.7272 3.08946 24.7439 3.83936 25.4938C4.58925 26.2437 5.60599 26.6655 6.6665 26.6667L14.6665 26.6667L14.6665 15.2188L11.6092 18.276C11.3584 18.5223 11.0205 18.6596 10.669 18.658C10.3175 18.6564 9.98088 18.5161 9.73234 18.2675C9.48379 18.019 9.34346 17.6823 9.34187 17.3309C9.34028 16.9794 9.47756 16.6415 9.72384 16.3907L15.0572 11.0574C15.1809 10.9335 15.3279 10.8353 15.4897 10.7682C15.6514 10.7012 15.8248 10.6667 15.9999 10.6667C16.175 10.6667 16.3483 10.7012 16.5101 10.7682C16.6718 10.8353 16.8188 10.9335 16.9426 11.0574L22.2759 16.3907C22.5233 16.6412 22.6616 16.9795 22.6605 17.3316C22.6593 17.6838 22.519 18.0212 22.27 18.2701C22.021 18.5191 21.6836 18.6595 21.3314 18.6606C20.9793 18.6617 20.6411 18.5234 20.3905 18.276L17.3332 15.2188L17.3332 26.6667L25.3332 26.6667C26.3937 26.6655 27.4104 26.2437 28.1603 25.4938C28.9102 24.7439 29.332 23.7272 29.3332 22.6667L29.3332 9.33335C29.332 8.27284 28.9102 7.2561 28.1603 6.50621C27.4104 5.75631 26.3937 5.33451 25.3332 5.33335L6.6665 5.33335C5.60599 5.33451 4.58925 5.75631 3.83935 6.50621C3.08946 7.2561 2.66766 8.27284 2.6665 9.33335V9.33335Z" fill="#9DC4F8" />
              </svg>


              <p className={` ${light ? 'text-black' : 'text-white'} font-semibold sm:whitespace-nowrap text-center`}>Drag & drop a file or <span className="text-[color:#3662E3]">browse files</span></p>
              <p className="text-gray-500 text-[0.80rem]">JPG,PNG or GIF - Max file size 2MB</p>
            </div>
          )}
        </main>
        <div className="flex justify-center relative -top-[9rem] gap-4 text-white">
          <button onClick={handleShare} className="flex gap-2 items-center px-4 py-2 bg-[color:#3662E3] rounded-lg"><svg width="16" height="16" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.05492 7.69499L4.11492 9.63499C3.88004 9.86167 3.56635 9.98836 3.23992 9.98836C2.91349 9.98836 2.5998 9.86167 2.36492 9.63499C2.24972 9.52024 2.15831 9.38388 2.09594 9.23373C2.03357 9.08357 2.00147 8.92258 2.00147 8.75999C2.00147 8.59739 2.03357 8.4364 2.09594 8.28625C2.15831 8.13609 2.24972 7.99973 2.36492 7.88499L4.30492 5.94499C4.39907 5.85083 4.45196 5.72314 4.45196 5.58999C4.45196 5.45684 4.39907 5.32914 4.30492 5.23499C4.21077 5.14083 4.08307 5.08794 3.94992 5.08794C3.81677 5.08794 3.68907 5.14083 3.59492 5.23499L1.65492 7.17999C1.2641 7.60538 1.05273 8.16532 1.06496 8.74286C1.07718 9.3204 1.31206 9.87089 1.72053 10.2794C2.12901 10.6878 2.6795 10.9227 3.25704 10.9349C3.83458 10.9472 4.39452 10.7358 4.81992 10.345L6.76492 8.40499C6.85907 8.31083 6.91196 8.18314 6.91196 8.04999C6.91196 7.91684 6.85907 7.78914 6.76492 7.69499C6.67077 7.60083 6.54307 7.54794 6.40992 7.54794C6.27677 7.54794 6.14907 7.60083 6.05492 7.69499V7.69499ZM10.3449 1.65499C9.92431 1.23699 9.35541 1.00238 8.76242 1.00238C8.16943 1.00238 7.60053 1.23699 7.17992 1.65499L5.23492 3.59499C5.1883 3.64161 5.15132 3.69695 5.12609 3.75786C5.10086 3.81877 5.08787 3.88406 5.08787 3.94999C5.08787 4.01592 5.10086 4.0812 5.12609 4.14211C5.15132 4.20302 5.1883 4.25837 5.23492 4.30499C5.28154 4.35161 5.33688 4.38859 5.39779 4.41382C5.4587 4.43905 5.52399 4.45203 5.58992 4.45203C5.65585 4.45203 5.72113 4.43905 5.78204 4.41382C5.84295 4.38859 5.8983 4.35161 5.94492 4.30499L7.88492 2.36499C8.1198 2.1383 8.43349 2.01161 8.75992 2.01161C9.08635 2.01161 9.40004 2.1383 9.63492 2.36499C9.75012 2.47973 9.84152 2.61609 9.90389 2.76625C9.96626 2.9164 9.99837 3.07739 9.99837 3.23999C9.99837 3.40258 9.96626 3.56357 9.90389 3.71373C9.84152 3.86388 9.75012 4.00024 9.63492 4.11499L7.69492 6.05499C7.64805 6.10147 7.61086 6.15677 7.58547 6.2177C7.56009 6.27863 7.54702 6.34398 7.54702 6.40999C7.54702 6.47599 7.56009 6.54134 7.58547 6.60227C7.61086 6.6632 7.64805 6.7185 7.69492 6.76499C7.7414 6.81185 7.7967 6.84905 7.85763 6.87443C7.91856 6.89982 7.98391 6.91289 8.04992 6.91289C8.11592 6.91289 8.18128 6.89982 8.24221 6.87443C8.30314 6.84905 8.35844 6.81185 8.40492 6.76499L10.3449 4.81999C10.7629 4.39938 10.9975 3.83047 10.9975 3.23749C10.9975 2.6445 10.7629 2.0756 10.3449 1.65499V1.65499ZM4.41492 7.58499C4.46164 7.63133 4.51705 7.66799 4.57797 7.69287C4.63888 7.71775 4.70411 7.73037 4.76992 7.72999C4.83572 7.73037 4.90095 7.71775 4.96187 7.69287C5.02279 7.66799 5.0782 7.63133 5.12492 7.58499L7.58492 5.12499C7.67907 5.03083 7.73196 4.90314 7.73196 4.76999C7.73196 4.63684 7.67907 4.50914 7.58492 4.41499C7.49077 4.32083 7.36307 4.26794 7.22992 4.26794C7.09677 4.26794 6.96907 4.32083 6.87492 4.41499L4.41492 6.87499C4.36805 6.92147 4.33086 6.97677 4.30547 7.0377C4.28009 7.09863 4.26702 7.16398 4.26702 7.22999C4.26702 7.29599 4.28009 7.36134 4.30547 7.42227C4.33086 7.4832 4.36805 7.5385 4.41492 7.58499Z" fill="#F9FAFB" />
          </svg>
            Share</button>
          <button onClick={handleDownload} className="flex gap-2 items-center px-4 py-2 bg-[color:#3662E3] rounded-lg"><svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.5 7C10.3674 7 10.2402 7.05268 10.1464 7.14645C10.0527 7.24021 10 7.36739 10 7.5V9.5C10 9.63261 9.94732 9.75979 9.85355 9.85355C9.75979 9.94732 9.63261 10 9.5 10H2.5C2.36739 10 2.24021 9.94732 2.14645 9.85355C2.05268 9.75979 2 9.63261 2 9.5V7.5C2 7.36739 1.94732 7.24021 1.85355 7.14645C1.75979 7.05268 1.63261 7 1.5 7C1.36739 7 1.24021 7.05268 1.14645 7.14645C1.05268 7.24021 1 7.36739 1 7.5V9.5C1 9.89782 1.15804 10.2794 1.43934 10.5607C1.72064 10.842 2.10218 11 2.5 11H9.5C9.89782 11 10.2794 10.842 10.5607 10.5607C10.842 10.2794 11 9.89782 11 9.5V7.5C11 7.36739 10.9473 7.24021 10.8536 7.14645C10.7598 7.05268 10.6326 7 10.5 7ZM5.645 7.855C5.69255 7.90052 5.74862 7.9362 5.81 7.96C5.86985 7.98645 5.93456 8.00012 6 8.00012C6.06544 8.00012 6.13015 7.98645 6.19 7.96C6.25138 7.9362 6.30745 7.90052 6.355 7.855L8.355 5.855C8.44915 5.76085 8.50205 5.63315 8.50205 5.5C8.50205 5.36685 8.44915 5.23915 8.355 5.145C8.26085 5.05085 8.13315 4.99795 8 4.99795C7.86685 4.99795 7.73915 5.05085 7.645 5.145L6.5 6.295V1.5C6.5 1.36739 6.44732 1.24021 6.35355 1.14645C6.25979 1.05268 6.13261 1 6 1C5.86739 1 5.74021 1.05268 5.64645 1.14645C5.55268 1.24021 5.5 1.36739 5.5 1.5V6.295L4.355 5.145C4.30838 5.09838 4.25304 5.0614 4.19212 5.03617C4.13121 5.01094 4.06593 4.99795 4 4.99795C3.93407 4.99795 3.86879 5.01094 3.80788 5.03617C3.74696 5.0614 3.69162 5.09838 3.645 5.145C3.59838 5.19162 3.5614 5.24696 3.53617 5.30788C3.51094 5.36879 3.49795 5.43407 3.49795 5.5C3.49795 5.56593 3.51094 5.63121 3.53617 5.69212C3.5614 5.75304 3.59838 5.80838 3.645 5.855L5.645 7.855Z" fill="#F9FAFB" />
          </svg>
            Download</button>
        </div>
      </div>
    </>
  )
} 