"use client";
import { useState } from "react"
import { useRouter } from "next/navigation"
import "../_resources/logo.svg"
import { useDropzone } from "react-dropzone";

export default function Home() {
  const [light, setLight] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  const handleClick = () => {
    setLight(!light);
  }
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.png', '.gif']
    },
    maxSize: 2 * 1024 * 1024, // 2MB
    onDrop: acceptedFiles => {
      if (acceptedFiles.length > 0) {
        setIsLoading(true);
        setProgress(0);

        // Simulação de progresso
        const interval = setInterval(() => {
          setProgress(prevProgress => {
            if (prevProgress >= 100) {
              clearInterval(interval);
              return 100;
            }
            return prevProgress + 10; // Ajuste este valor para controlar a velocidade
          });
        }, 200); // Ajuste este valor para controlar a frequência de atualização

        const reader = new FileReader();
        reader.onload = (event) => {
          const base64 = event.target.result.split(',')[1];
          localStorage.setItem('uploadedImage', JSON.stringify({
            name: acceptedFiles[0].name,
            type: acceptedFiles[0].type,
            size: acceptedFiles[0].size,
            lastModified: acceptedFiles[0].lastModified,
            base64: base64
          }));
          setTimeout(() => {
            clearInterval(interval); // Limpa o intervalo quando o carregamento estiver completo
            setIsLoading(false);
            router.push('/upload');
          }, 2000);
        };
        reader.readAsDataURL(acceptedFiles[0]);
      }
    }
  });
  return (
    <>
      <div className={`flex flex-col w-screen h-dvh ${light ? 'bg-[color:#F9FAFB] text-gray-800' : 'bg-[color:#121826] text-white'} overflow-hidden`}>
        <nav className={`flex justify-between px-4 sm:px-10 py-7 items-center border-b ${light ? 'border-[#E5E7EB]' : 'border-[#4D5562]'} `}>
          <div className="flex gap-2 items-center font-semibold">
            <svg width="30" height="30" viewBox="0 0 22 26" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path opacity="0.6" d="M0 2C0 0.895431 0.895431 0 2 0H14C15.1046 0 16 0.895431 16 2V14C16 15.1046 15.1046 16 14 16H2C0.895431 16 0 15.1046 0 14V2Z" fill="#9DC4F8" />
              <path d="M6 6C6 4.89543 6.89543 4 8 4H20C21.1046 4 22 4.89543 22 6V18C22 19.1046 21.1046 20 20 20H8C6.89543 20 6 19.1046 6 18V6Z" fill="#3662E3" />
              <path d="M10.2927 14.707C10.3855 14.7999 10.4957 14.8736 10.617 14.9238C10.7384 14.9741 10.8684 15 10.9997 15C11.131 15 11.2611 14.9741 11.3824 14.9238C11.5037 14.8736 11.6139 14.7999 11.7067 14.707L12.9997 13.4141L12.9997 25C12.9997 25.2652 13.105 25.5196 13.2926 25.7071C13.4801 25.8946 13.7345 26 13.9997 26C14.2649 26 14.5192 25.8946 14.7068 25.7071C14.8943 25.5196 14.9997 25.2652 14.9997 25L14.9997 13.4141L16.2927 14.707C16.4808 14.8917 16.7342 14.9947 16.9978 14.9935C17.2614 14.9923 17.5139 14.887 17.7003 14.7006C17.8867 14.5142 17.992 14.2617 17.9932 13.9981C17.9943 13.7345 17.8914 13.4811 17.7067 13.293L14.7067 10.293C14.6138 10.2001 14.5036 10.1264 14.3823 10.0762C14.261 10.0259 14.131 10 13.9996 10C13.8683 10 13.7383 10.0259 13.617 10.0762C13.4957 10.1264 13.3855 10.2001 13.2926 10.293L10.2926 13.293C10.1998 13.3858 10.1261 13.4961 10.0758 13.6174C10.0256 13.7387 9.9997 13.8687 9.9997 14C9.99971 14.1313 10.0256 14.2613 10.0759 14.3827C10.1261 14.504 10.1998 14.6142 10.2927 14.707V14.707Z" fill="#C2DAF9" />
            </svg>
            ImageUpload</div>
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
          <div className={`w-[88vw] h-[40vh] box-shadown absolute sm:w-[47rem] sm:h-[32rem] ${light ? 'bg-white' : 'bg-[color:#212936]'} ${isLoading ?'hidden':'visible'} rounded-lg shadow-md`}></div>
          {isLoading ? (
            <div className={`w-[85vw] h-[50vh] sm:w-[45rem] sm:h-[10rem] ${light ? 'bg-white' : 'bg-[color:#212936]'} p-4 rounded-lg flex flex-col justify-center items-center gap-2 z-20 relative box-shadown`}>
              <p className={`${light ? 'text-black' : 'text-white'}`}>
                <span className="font-bold">Uploading</span>, please wait...
              </p>
              <div className="w-[90%] bg-gray-200 rounded-full h-3 mb-4">
                <div
                  className="bg-[color:#3662E3] h-3 rounded-full transition-all duration-300 ease-in-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          ) : (
            <div {...getRootProps()} className={`w-[85vw] h-[50vh] sm:w-[45rem] sm:h-[30rem] ${light ? 'bg-white border-[color:#E5E7EB]' : 'bg-[color:#212936] border-[#4D5562]'} p-4 border-2 border-dashed rounded-lg flex flex-col justify-center items-center gap-2 z-20 relative cursor-pointer`}>
              <input {...getInputProps()} />
              <svg width="32" height="50" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.0571 11.0574L9.72378 16.3907C9.4775 16.6415 9.34022 16.9794 9.34181 17.3309C9.3434 17.6823 9.48374 18.019 9.73228 18.2675C9.98082 18.5161 10.3175 18.6564 10.6689 18.658C11.0204 18.6596 11.3583 18.5223 11.6091 18.276L14.6664 15.2188L14.6664 26.6667L17.3331 26.6667L17.3331 15.2188L20.3904 18.2761C20.514 18.4012 20.661 18.5006 20.8231 18.5686C20.9852 18.6367 21.1591 18.672 21.3349 18.6725C21.5107 18.6731 21.6848 18.6388 21.8473 18.5718C22.0098 18.5048 22.1575 18.4063 22.2818 18.282C22.4061 18.1577 22.5046 18.0101 22.5716 17.8475C22.6386 17.685 22.6728 17.5109 22.6722 17.3351C22.6717 17.1593 22.6364 16.9854 22.5683 16.8233C22.5003 16.6612 22.4009 16.5142 22.2758 16.3907L16.9424 11.0574C16.8187 10.9335 16.6717 10.8353 16.51 10.7683C16.3482 10.7013 16.1749 10.6668 15.9998 10.6668C15.8247 10.6668 15.6513 10.7013 15.4896 10.7683C15.3278 10.8353 15.1809 10.9335 15.0571 11.0574Z" fill="#3662E3" />
                <path d="M2.6665 9.33335L2.6665 22.6667C2.66766 23.7272 3.08946 24.7439 3.83936 25.4938C4.58925 26.2437 5.60599 26.6655 6.6665 26.6667L14.6665 26.6667L14.6665 15.2188L11.6092 18.276C11.3584 18.5223 11.0205 18.6596 10.669 18.658C10.3175 18.6564 9.98088 18.5161 9.73234 18.2675C9.48379 18.019 9.34346 17.6823 9.34187 17.3309C9.34028 16.9794 9.47756 16.6415 9.72384 16.3907L15.0572 11.0574C15.1809 10.9335 15.3279 10.8353 15.4897 10.7682C15.6514 10.7012 15.8248 10.6667 15.9999 10.6667C16.175 10.6667 16.3483 10.7012 16.5101 10.7682C16.6718 10.8353 16.8188 10.9335 16.9426 11.0574L22.2759 16.3907C22.5233 16.6412 22.6616 16.9795 22.6605 17.3316C22.6593 17.6838 22.519 18.0212 22.27 18.2701C22.021 18.5191 21.6836 18.6595 21.3314 18.6606C20.9793 18.6617 20.6411 18.5234 20.3905 18.276L17.3332 15.2188L17.3332 26.6667L25.3332 26.6667C26.3937 26.6655 27.4104 26.2437 28.1603 25.4938C28.9102 24.7439 29.332 23.7272 29.3332 22.6667L29.3332 9.33335C29.332 8.27284 28.9102 7.2561 28.1603 6.50621C27.4104 5.75631 26.3937 5.33451 25.3332 5.33335L6.6665 5.33335C5.60599 5.33451 4.58925 5.75631 3.83935 6.50621C3.08946 7.2561 2.66766 8.27284 2.6665 9.33335V9.33335Z" fill="#9DC4F8" />
              </svg>


              <p className={` ${light ? 'text-black' : 'text-white'} font-semibold sm:whitespace-nowrap text-center`}>Drag & drop a file or <span className="text-[color:#3662E3]">browse files</span></p>
              <p className="text-gray-500 text-[0.80rem]">JPG,PNG or GIF - Max file size 2MB</p>
            </div>
          )}
        </main>
      </div>
    </>
  )
} 