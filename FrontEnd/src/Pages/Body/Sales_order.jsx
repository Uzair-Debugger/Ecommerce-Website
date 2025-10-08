
import React, { use, useEffect, useState } from "react";
import { Package, Truck, CheckCircle, Clock, XCircle, Trash2, Eye, ChevronDown } from "lucide-react";
import { toast } from "react-toastify";
import OrderSummary from './OrderSummary'
import { jwtDecode } from "jwt-decode";

const SalesOrder = () => {
 return(
  <OrderSummary/>
 )
};

export default SalesOrder;