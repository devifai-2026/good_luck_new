import React from "react";

import HomeScreenLayout from "../../components/Layouts/homeLayOut";

import ProductListComponent from "../../components/Shared/productListComponent";
import { useSelector } from "react-redux";
import { RootState } from "../../redux";
import AstrologerHomeScreenLayout from "../../components/Layouts/astrologerHomeLayout";
import { UserRoleEnum } from "../../redux/redux.constants";

const ProductList = ({
  navigation,
  route: {
    params: { id },
  },
}: {
  navigation: any;
  route: any;
}) => {
  const role = useSelector((state: RootState) => state.auth.userDetails?.role);

  return role === UserRoleEnum.astrologer ? (
    <AstrologerHomeScreenLayout>
      <ProductListComponent
        navigation={navigation}
        route={{ params: { id } }}
      />
    </AstrologerHomeScreenLayout>
  ) : (
    <HomeScreenLayout>
      <ProductListComponent
        navigation={navigation}
        route={{ params: { id } }}
      />
    </HomeScreenLayout>
  );
};

export default ProductList;
