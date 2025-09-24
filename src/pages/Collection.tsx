import collectionImg from '@/assets/collection.svg';

const Collection = () => {
  return (
    <div
      className="relative min-h-screen w-full bg-cover bg-center bg-no-repeat flex items-end justify-center"
      style={{ backgroundImage: `url(${collectionImg})` }}
    >
      <p className="mb-8 text-center text-white text-lg md:text-2xl font-semibold drop-shadow-lg">
        The Full Collection
      </p>
    </div>
  );
};

export default Collection;
