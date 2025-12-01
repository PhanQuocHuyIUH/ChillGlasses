import AdminHeader
  from "@/components/layout/AdminHeader";
const CategoryPage = () => {
  return (
    <div>
      <AdminHeader />
      <div className="h-screen flex justify-center items-center bg-gray-100">
        <h1 className="text-3xl font-bold">Category Management Page</h1>
      </div>
    </div>
  )
}
export default CategoryPage;