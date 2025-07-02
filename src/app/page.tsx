import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-w-full min-h-full min-h-screen">

      <div className="flex flex-col gap-10 items-center justify-evenly p-5 min-h-screen blood-intro-page bg-gray-100 dark:bg-gray-800">

        <div className="flex flex-col w-full gap-3 items-center">
          <h1 className="welcometitle text-4xl font-bold">
            Blood Donation
          </h1>
          <h2 className="welcometitlebelow text-3xl font-bold">
            Welcome to Blood Donation
          </h2>
        </div>


        <div className="blood-image-description md:flex justify-center w-full h-full">
          <div className="image-container p-2 md:w-1/2 h-full flex justify-center">
            <Image src="/blood.jpg" alt="blood" width={500} height={500} />
          </div>

          <div className="some-description p-2 md:w-1/2 h-full flex">
            <p className="text-box h-full text-lg leading-relaxed">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Magni atque nostrum at, eveniet quas sint blanditiis maiores amet, praesentium soluta beatae? Quibusdam aliquam labore eius impedit reiciendis. Amet aliquid, ducimus ipsam sint, debitis reprehenderit cupiditate repudiandae asperiores corporis molestias non assumenda iusto.
            </p>
          </div>
        </div>

      </div>

      <div className="flex flex-col gap-10 items-center p-5 justify-around min-h-screen description-page bg-blue-300 dark:bg-blue-700">

        <div className="about-us-container flex items-center">
          <h2 className="text-2xl font-bold">
            About Us
          </h2>
        </div>
        <div className="about-description-container flex md:flex-row flex-col-reverse p-2 justify-center items-center w-full h-96">
          <div className="some-description p-2 md:w-1/2 w-full h-full flex justify-center text-lg">
            <p className="text-box leading-relaxed">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Animi quaerat, non neque obcaecati similique beatae corrupti facilis dolore iure fugit deleniti hic quisquam quia sapiente eius ullam consectetur cupiditate esse ipsam aspernatur illo ratione tenetur alias! Cupiditate repudiandae aliquam aspernatur consequatur est!
            </p>
          </div>
          <div className="image-container p-2 md:w-1/2 w-full h-full flex justify-center">
            <img src="group.jpeg" className="h-full object-fill" alt="United We Stand, Divided We Fall" />
          </div>
        </div>

      </div>

      <div className="flex flex-col gap-10 justify-evenly items-center justify-center p-5 min-h-screen description-page bg-green-300 dark:bg-green-600">

        <div className="about-us-container flex items-center">
          <h2 className="text-2xl font-bold">
            Services
          </h2>
        </div>
        <div className="about-description-container flex md:flex-row flex-col-reverse p-2 justify-center w-full h-96">
          <div className="image-container p-2 md:w-1/2 w-full h-full flex justify-center">
            <img src="services.jpg" className="h-full object-fill" alt="United We Stand, Divided We Fall" />
          </div>
          <div className="some-description p-2 md:w-1/2 w-full h-full flex justify-center items-center text-lg">
            <p className="text-box h-full leading-relaxed">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Animi quaerat, non neque obcaecati similique beatae corrupti facilis dolore iure fugit deleniti hic quisquam quia sapiente eius ullam consectetur cupiditate esse ipsam aspernatur illo ratione tenetur alias! Cupiditate repudiandae aliquam aspernatur consequatur est!
            </p>
          </div>
        </div>

      </div>

      <div className="flex flex-col gap-10 items-center p-5 min-h-screen justify-evenly description-page bg-yellow-300 dark:bg-yellow-600">

        <div className="about-us-container flex items-center">
          <h2 className="text-2xl font-bold">
            Contact Us
          </h2>
        </div>
        <div className="about-description-container flex md:flex-row flex-col-reverse p-2 justify-center w-full h-96">
          <div className="some-description p-2 md:w-1/2 w-full h-full flex justify-center text-lg">
            <p className="text-box leading-relaxed">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Animi quaerat, non neque obcaecati similique beatae corrupti facilis dolore iure fugit deleniti hic quisquam quia sapiente eius ullam consectetur cupiditate esse ipsam aspernatur illo ratione tenetur alias! Cupiditate repudiandae aliquam aspernatur consequatur est!
            </p>
          </div>
          <div className="image-container p-2 md:w-1/2 w-full h-full flex justify-center">
            <img src="contact.jpg" className="h-full object-fill" alt="United We Stand, Divided We Fall" />
          </div>
        </div>

      </div>


    </div>
  )
}
